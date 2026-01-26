import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// Create order for logged-in user
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { addressId, address, phone, total, items } = await request.json();

        // Validate required fields
        if (!address || !phone || !total || !items?.length) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check stock availability for all items
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                return NextResponse.json(
                    { error: `Product ${item.productName} not found` },
                    { status: 400 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${item.productName}. Available: ${product.stock}` },
                    { status: 400 }
                );
            }
        }

        // Create order and decrease stock in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    customerName: session.user.name || "",
                    customerEmail: session.user.email || "",
                    customerPhone: phone,
                    address,
                    total,
                    status: "PENDING",
                    items: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            productName: item.productName || "Unknown Product",
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });

            // Decrease stock for each product
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return newOrder;
        });

        return NextResponse.json({ orderId: order.id, success: true });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
