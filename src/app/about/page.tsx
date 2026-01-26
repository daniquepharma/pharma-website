import { Suspense } from "react";
import About from "@/components/About";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LicensesSection from "@/components/LicensesSection";

export default function AboutPage() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Suspense fallback={<div className="h-20 bg-slate-950" />}>
                <Navbar />
            </Suspense>
            <div className="pt-20">
                <About />
                <LicensesSection />
            </div>
            <Footer />
        </main>
    );
}
