import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Navbar />
      <Hero />
      <Carousel />
      <Footer />
    </main>
  );
}
