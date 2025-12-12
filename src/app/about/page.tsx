import About from "@/components/About";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-20">
                <About />
            </div>
            <Footer />
        </main>
    );
}
