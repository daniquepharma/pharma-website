import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { businessName, drugLicense, gstNumber } = await request.json();

        if (!businessName || !drugLicense) {
            return NextResponse.json(
                { error: "Business Name and Drug License are required fields." },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                businessName,
                drugLicense,
                gstNumber,
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Complete profile error:", error);
        return NextResponse.json(
            { error: "Something went wrong saving your profile" },
            { status: 500 }
        );
    }
}
