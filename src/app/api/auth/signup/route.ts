import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { name, email, phone, password, businessName, drugLicense, gstNumber } = await request.json();

        if (!name || !email || !password || !businessName || !drugLicense) {
            return NextResponse.json(
                { error: "Missing required fields: Name, Email, Password, Business Name and Drug License are required." },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                businessName,
                drugLicense,
                gstNumber,
            },
        });

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: `Something went wrong: ${error.message || error.toString()}` },
            { status: 500 }
        );
    }
}
