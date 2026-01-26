import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Update order details
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAuth = await isAuthenticated();

        if (!isAuth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { customerName, customerPhone, address } = await request.json();

        const order = await prisma.order.update({
            where: { id },
            data: {
                customerName,
                customerPhone,
                address,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Update order error:", error);
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}
