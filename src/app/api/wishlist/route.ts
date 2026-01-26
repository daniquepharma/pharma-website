import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// Get wishlist
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const wishlist = await prisma.wishlistItem.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        stock: true,
                        images: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error("Fetch wishlist error:", error);
        return NextResponse.json(
            { error: "Failed to fetch wishlist" },
            { status: 500 }
        );
    }
}

// Add to wishlist
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await request.json();

        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId: session.user.id,
                productId,
            },
        });

        return NextResponse.json(wishlistItem);
    } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (error instanceof Error && (error as any).code === "P2002") {
            return NextResponse.json(
                { error: "Product already in wishlist" },
                { status: 400 }
            );
        }
        console.error("Add to wishlist error:", error);
        return NextResponse.json(
            { error: "Failed to add to wishlist" },
            { status: 500 }
        );
    }
}
