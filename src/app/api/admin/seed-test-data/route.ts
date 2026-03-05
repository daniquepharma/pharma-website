import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        console.log("Seeding Razorpay test data...");

        // 1. Create a Test Product
        const testProduct = await prisma.product.upsert({
            where: { id: "test-product-razorpay" },
            update: {},
            create: {
                id: "test-product-razorpay",
                name: "Razorpay Test Product",
                description: "A very cheap product for Razorpay verification purposes",
                price: 1, // Minimum amount possible (₹1)
                stock: 1000,
                category: "Test",
                images: [],
            },
        });

        // 2. Create a Test User
        const hashedPassword = await bcrypt.hash("razorpaytest123", 10);
        const testUser = await prisma.user.upsert({
            where: { email: "razorpay@example.com" },
            update: {
                password: hashedPassword, // Reset password to ensure it's always this one
            },
            create: {
                name: "Razorpay Reviewer",
                email: "razorpay@example.com",
                password: hashedPassword,
                phone: "9999999999",
                emailVerified: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Successfully seeded Razorpay test data in production!",
            user: testUser.email,
            product: testProduct.name
        });

    } catch (error: any) {
        console.error("Failed to seed Razorpay data:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
