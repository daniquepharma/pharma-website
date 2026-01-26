import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// Cancel order
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: orderId } = await params;

        // Get order with items
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Check if order belongs to user
        if (order.userId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if order can be cancelled (only PENDING or CONFIRMED)
        if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
            return NextResponse.json(
                { error: `Cannot cancel order with status: ${order.status}` },
                { status: 400 }
            );
        }

        // Cancel order and restore stock in transaction
        await prisma.$transaction(async (tx) => {
            // Update order status to CANCELLED
            await tx.order.update({
                where: { id: orderId },
                data: { status: "CANCELLED" },
            });

            // Restore stock for each item
            for (const item of order.items) {
                if (item.productId) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }
            }
        });

        return NextResponse.json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
        console.error("Cancel order error:", error);
        return NextResponse.json(
            { error: "Failed to cancel order" },
            { status: 500 }
        );
    }
}
