import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// Delete from wishlist
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.wishlistItem.delete({
            where: {
                id: id,
                userId: session.user.id, // Ensure user owns this item
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete wishlist item error:", error);
        return NextResponse.json(
            { error: "Failed to remove from wishlist" },
            { status: 500 }
        );
    }
}
