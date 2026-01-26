import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// GET - Fetch all addresses for the logged-in user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: [
                { isDefault: "desc" }, // Default address first
                { createdAt: "desc" }  // Then by creation date
            ],
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error("Fetch addresses error:", error);
        return NextResponse.json(
            { error: "Failed to fetch addresses" },
            { status: 500 }
        );
    }
}

// POST - Create a new address
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = await request.json();

        // Validate required fields
        if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // If this is set as default, unset other default addresses
        if (isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true,
                },
                data: { isDefault: false },
            });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: session.user.id,
                fullName,
                phone,
                addressLine1,
                addressLine2: addressLine2 || null,
                city,
                state,
                pincode,
                isDefault: isDefault || false,
            },
        });

        return NextResponse.json(newAddress, { status: 201 });
    } catch (error) {
        console.error("Create address error:", error);
        return NextResponse.json(
            { error: "Failed to create address" },
            { status: 500 }
        );
    }
}

// DELETE - Delete an address
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const addressId = searchParams.get("id");

        if (!addressId) {
            return NextResponse.json(
                { error: "Address ID required" },
                { status: 400 }
            );
        }

        // Verify the address belongs to the user
        const address = await prisma.address.findFirst({
            where: {
                id: addressId,
                userId: session.user.id,
            },
        });

        if (!address) {
            return NextResponse.json(
                { error: "Address not found" },
                { status: 404 }
            );
        }

        await prisma.address.delete({
            where: { id: addressId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete address error:", error);
        return NextResponse.json(
            { error: "Failed to delete address" },
            { status: 500 }
        );
    }
}
