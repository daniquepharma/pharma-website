import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LicensesSection from "@/components/LicensesSection";
import { ShieldCheck, MapPin, Building2, FileCheck, Stethoscope } from "lucide-react";

export const metadata = {
    title: "Compliance & Licensing | Danique Formulations",
    description: "Official licenses, regulatory compliance, and business details for Danique Formulations wholesale distributor.",
};

export default function CompliancePage() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Suspense fallback={<div className="h-20 bg-slate-950" />}>
                <Navbar />
            </Suspense>

            <div className="pt-32 pb-16 px-4 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                        Compliance & Licensing
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Danique Formulations is a fully licensed wholesale pharmaceutical distributor. We strictly adhere to all guidelines set by the Drugs Control Department and the Drugs and Cosmetics Act, 1940.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Business Information */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <Building2 className="text-primary w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">Business Details</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-slate-500 w-5 h-5 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-medium">Registered Address</h3>
                                    <p className="text-slate-400 text-sm mt-1">
                                        326, Third Floor, Vardhman Jaypee Plaza,<br />
                                        Sector 4, Dwarka, New Delhi - 110075
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <ShieldCheck className="text-slate-500 w-5 h-5 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-medium">FSSAI License</h3>
                                    <p className="text-slate-400 text-sm mt-1 mb-2">
                                        Department Of Food Safety<br />
                                        Government of Delhi
                                    </p>
                                    <p className="font-mono bg-slate-950 px-3 py-2 rounded-lg inline-block border border-slate-800">
                                        <span className="text-slate-500 text-xs block mb-1">License Number</span>
                                        <span className="text-primary font-bold tracking-wider">13324011000988</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Drug Licenses */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                            <ShieldCheck className="text-primary w-6 h-6" />
                            <h2 className="text-2xl font-bold text-white">Drug Licenses</h2>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-400 text-sm mb-4">
                                Issued by the Drugs Control Department, Government of NCT of Delhi.
                            </p>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Form 20B</p>
                                    <p className="text-white text-sm">Wholesale of drugs other than those in Schedule C, C(1) and X</p>
                                </div>
                                <span className="text-primary font-mono font-bold tracking-wider">WLF20B2024DL001701</span>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Form 21B</p>
                                    <p className="text-white text-sm">Wholesale of drugs specified in Schedule C and C(1)</p>
                                </div>
                                <span className="text-primary font-mono font-bold tracking-wider">WLF21B2024DL001684</span>
                            </div>

                            <div className="flex items-start gap-3 mt-6 pt-4 border-t border-slate-800">
                                <Stethoscope className="text-primary w-5 h-5 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-medium">Competent Person / Pharmacist</h3>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Duly registered and verified by the central governing authority. Details available in the official license documents below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pull in the PDF viewer from existing component */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <LicensesSection />
                </div>
            </div>

            <Footer />
        </main>
    );
}
