import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-20">
                <Contact />
            </div>
            <Footer />
        </main>
    );
}
