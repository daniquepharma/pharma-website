
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeCarousel from "@/components/HomeCarousel";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="bg-slate-950 min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-20 bg-slate-950" />}>
        <Navbar />
      </Suspense>

      {/* Hero Section with Carousel */}
      <div className="relative">
        <HomeCarousel />
      </div>

      {/* Content Sections - Preserving Footer */}
      <Footer />
    </main>
  );
}
