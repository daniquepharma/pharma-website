import { Info } from "lucide-react";

export default function WholesaleBanner() {
    return (
        <div className="bg-slate-950 border-y border-white/5 py-4">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left">
                <Info className="text-primary w-5 h-5 flex-shrink-0" />
                <p className="text-slate-400 text-sm font-medium">
                    <span className="text-white">Wholesale Notice:</span> This platform is intended for licensed pharmacies, hospitals, and medical institutions. Retail purchases are not supported.
                </p>
            </div>
        </div>
    );
}
