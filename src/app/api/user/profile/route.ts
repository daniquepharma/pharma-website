import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

// Get user profile with default address
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                createdAt: true,
                addresses: {
                    where: { isDefault: true },
                    take: 1,
                }
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Flatten the structure for the frontend
        const defaultAddress = user.addresses[0] || null;

        return NextResponse.json({
            ...user,
            address: defaultAddress ? {
                addressLine1: defaultAddress.addressLine1,
                city: defaultAddress.city,
                state: defaultAddress.state,
                pincode: defaultAddress.pincode,
            } : null
        });
    } catch (error) {
        console.error("Fetch user profile error:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

// Update user profile (phone and address)
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { phone, address } = await request.json();

        // Transaction to update user and address
        await prisma.$transaction(async (tx) => {
            // Update User Phone
            if (phone !== undefined) {
                await tx.user.update({
                    where: { id: session.user.id },
                    data: { phone },
                });
            }

            // Update or Create Default Address
            if (address) {
                // Check for existing default address
                const existingAddress = await tx.address.findFirst({
                    where: { userId: session.user.id, isDefault: true },
                });

                if (existingAddress) {
                    await tx.address.update({
                        where: { id: existingAddress.id },
                        data: {
                            addressLine1: address.addressLine1,
                            city: address.city,
                            state: address.state,
                            pincode: address.pincode,
                            fullName: session.user.name || "User", // Fallback
                            phone: phone || existingAddress.phone, // Use new phone or existing
                        },
                    });
                } else {
                    await tx.address.create({
                        data: {
                            userId: session.user.id,
                            addressLine1: address.addressLine1,
                            city: address.city,
                            state: address.state,
                            pincode: address.pincode,
                            fullName: session.user.name || "User",
                            phone: phone || "",
                            isDefault: true,
                        },
                    });
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update user profile error:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
