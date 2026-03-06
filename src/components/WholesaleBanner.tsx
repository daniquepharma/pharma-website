import { AlertTriangle } from "lucide-react";

export default function WholesaleBanner() {
    return (
        <div className="bg-red-950/50 border-y border-red-500/50 text-white py-6">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                <div className="bg-red-600/20 p-3 rounded-full flex-shrink-0 animate-pulse">
                    <AlertTriangle className="text-red-500 w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-red-500 mb-1 tracking-wider uppercase">
                        Important Notice
                    </h3>
                    <p className="text-slate-300 font-medium">
                        This website is intended only for licensed medical businesses. Retail customers are <span className="text-white font-bold underline decoration-red-500">not permitted</span> to purchase medicines through this platform.
                    </p>
                </div>
            </div>
        </div>
    );
}
