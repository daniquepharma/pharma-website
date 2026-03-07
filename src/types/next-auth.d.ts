import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            businessName?: string | null;
            drugLicense?: string | null;
            gstNumber?: string | null;
            isVerified: boolean;
        }
    }

    interface User {
        businessName?: string | null;
        drugLicense?: string | null;
        gstNumber?: string | null;
        isVerified: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        businessName?: string | null;
        drugLicense?: string | null;
        gstNumber?: string | null;
        isVerified: boolean;
    }
}
