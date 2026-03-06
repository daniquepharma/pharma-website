import { Building2, Hospital, Stethoscope, Store, ShieldCheck, FileCheck } from "lucide-react";

export default function WholesaleCompliance() {
    return (
        <section className="bg-slate-900 py-16 border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

                {/* Who Can Purchase Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Building2 className="text-primary w-8 h-8" />
                        <h2 className="text-3xl font-heading font-bold text-white">Who Can Purchase</h2>
                    </div>

                    <p className="text-slate-400">
                        Danique Formulations strictly supplies exclusively to B2B clients. To maintain regulatory compliance, orders are only accepted from the following authorized entities:
                    </p>

                    <ul className="space-y-4 mt-6">
                        <li className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <Store className="text-blue-400 w-6 h-6 flex-shrink-0" />
                            <span className="text-white font-medium text-lg">Licensed Pharmacies</span>
                        </li>
                        <li className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <Hospital className="text-green-400 w-6 h-6 flex-shrink-0" />
                            <span className="text-white font-medium text-lg">Hospitals and Clinics</span>
                        </li>
                        <li className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <Stethoscope className="text-purple-400 w-6 h-6 flex-shrink-0" />
                            <span className="text-white font-medium text-lg">Medical Institutions</span>
                        </li>
                        <li className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <ShieldCheck className="text-yellow-400 w-6 h-6 flex-shrink-0" />
                            <span className="text-white font-medium text-lg">Authorized Drug Distributors</span>
                        </li>
                    </ul>
                </div>

                {/* Compliance Section */}
                <div className="space-y-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-primary w-8 h-8" />
                        <h2 className="text-3xl font-heading font-bold text-white">Compliance</h2>
                    </div>

                    <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ShieldCheck className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <p className="text-slate-300 leading-relaxed text-lg">
                                Danique Formulations operates under wholesale drug licenses issued by the Drugs Control Department, Delhi.
                            </p>

                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                                <h4 className="text-slate-400 font-bold uppercase tracking-wider text-sm">Valid Licence Numbers</h4>
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                                        <span className="text-slate-400 text-sm">Form 20B</span>
                                        <span className="text-white font-mono font-bold tracking-wider text-lg">WLF20B2024DL001701</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                                        <span className="text-slate-400 text-sm">Form 21B</span>
                                        <span className="text-white font-mono font-bold tracking-wider text-lg">WLF21B2024DL001684</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-400 text-sm italic border-l-2 border-primary pl-4 py-1">
                                All sales are conducted strictly in accordance with the Drugs and Cosmetics Act, 1940.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
