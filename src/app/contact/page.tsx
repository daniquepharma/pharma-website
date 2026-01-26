import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function ContactPage() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Suspense fallback={<div className="h-20 bg-slate-950" />}>
                <Navbar />
            </Suspense>
            <div className="pt-20">
                <Contact />
            </div>
            <Footer />
        </main>
    );
}
