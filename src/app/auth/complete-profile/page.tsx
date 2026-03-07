"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CompleteProfilePage() {
    const { update } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            businessName: formData.get("businessName") as string,
            drugLicense: formData.get("drugLicense") as string,
            gstNumber: formData.get("gstNumber") as string,
        };

        try {
            const response = await fetch("/api/auth/complete-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update profile");
            }

            // Tell NextAuth to update the session in the client
            await update({
                businessName: data.businessName,
                drugLicense: data.drugLicense,
                gstNumber: data.gstNumber,
            });

            router.push("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
                    <p className="text-slate-400">Danique Formulations is a B2B platform. Please provide your business details to continue.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">
                                Pharmacy / Business Name *
                            </label>
                            <input
                                type="text"
                                name="businessName"
                                required
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="e.g. Apollo Pharmacy"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">
                                Drug License / FSSAI Number *
                            </label>
                            <input
                                type="text"
                                name="drugLicense"
                                required
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Valid License Number"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">
                                GST Number (Optional)
                            </label>
                            <input
                                type="text"
                                name="gstNumber"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="GSTIN"
                            />
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input
                                type="checkbox"
                                name="b2bConfirm"
                                id="b2bConfirm"
                                required
                                className="mt-1 w-4 h-4 bg-slate-950 border-slate-700 rounded text-primary focus:ring-primary"
                            />
                            <label htmlFor="b2bConfirm" className="text-sm text-slate-400">
                                I declare that I am purchasing on behalf of a licensed pharmacy, hospital, or medical institution. I understand that retail purchases for personal use are strictly not supported.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-slate-950 font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Saving details...
                                </>
                            ) : (
                                "Complete Profile"
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
