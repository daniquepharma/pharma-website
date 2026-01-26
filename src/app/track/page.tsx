import TrackOrderForm from "@/components/TrackOrderForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function TrackOrderPage() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Suspense fallback={<div className="h-20 bg-slate-950" />}>
                <Navbar />
            </Suspense>
            <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                    Track Your Order
                </h1>
                <p className="text-slate-400 text-lg mb-12">
                    Enter your Order ID to check the real-time delivery status of your medicines.
                </p>

                <TrackOrderForm />
            </div>
            <Footer />
        </main>
    );
}
