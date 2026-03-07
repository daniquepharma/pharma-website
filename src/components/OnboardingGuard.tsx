"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const isExemptPath =
        pathname.startsWith("/auth/complete-profile") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/api");

    const needsOnboarding = !isExemptPath && session?.user && !session.user.businessName;

    useEffect(() => {
        if (status === "loading") return;

        if (needsOnboarding) {
            // User is logged in but missing B2B details
            router.replace("/auth/complete-profile");
        }
    }, [needsOnboarding, status, router]);

    if (status === "loading" || needsOnboarding) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-400">Verifying profile...</p>
            </div>
        );
    }

    return <>{children}</>;
}
