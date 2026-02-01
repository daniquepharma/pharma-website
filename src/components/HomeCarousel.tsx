
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    "/home_carasoul/slide-1.png",
    "/home_carasoul/slide-2.png",
    "/home_carasoul/slide-3.png",
    "/home_carasoul/slide-4.png",
    "/home_carasoul/slide-5.png",
    "/home_carasoul/slide-6.jpeg",
    "/home_carasoul/slide-7.jpg",
    "/home_carasoul/slide-8.jpg",
    "/home_carasoul/slide-9.jpg",
    "/home_carasoul/slide-10.jpg",
    "/home_carasoul/slide-11.jpg",
    "/home_carasoul/slide-12.jpg",
];

const texts = [
    {
        title: "Innovating for a Healthier Tomorrow",
        subtitle: "Advanced Formulation Technologies"
    },
    {
        title: "Excellence in Manufacturing",
        subtitle: "State-of-the-art Production Facilities"
    },
    {
        title: "Quality You Can Trust",
        subtitle: "Rigorous Quality Control Standards"
    },
    {
        title: "Wide Range of Solutions",
        subtitle: "From Tablets to Injectables"
    },
    {
        title: "Dedicated to Life",
        subtitle: "Committed to Improving Global Health"
    },
    {
        title: "Healthcare for Everyone",
        subtitle: "Affordable and Accessible Medicines"
    }
];

export default function HomeCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const currentText = texts[currentIndex % texts.length];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-950">
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    {/* Image */}
                    <div className="absolute inset-0 bg-slate-900">
                        <img
                            src={images[currentIndex]}
                            alt={`Slide ${currentIndex + 1}`}
                            className="w-full h-full object-cover opacity-60"
                        />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center pt-20">
                        <div className="text-center px-4 max-w-4xl mx-auto">
                            {/* Dynamic Slide Content */}
                            <motion.div
                                key={currentIndex} // Force re-animation on slide change
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                                    {currentText.title}
                                </h2>
                                <p className="text-lg md:text-xl text-slate-200 font-light tracking-wide max-w-2xl mx-auto">
                                    {currentText.subtitle}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Static Tagline Overlay */}
            <div className="absolute bottom-20 left-0 right-0 z-20 flex justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-center px-4"
                >

                    <h1 className="font-heading text-3xl md:text-5xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 leading-tight drop-shadow-2xl">
                        HEALING HANDS, CARING HEARTS <br />
                    </h1>
                </motion.div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all border border-white/10 group z-10 hidden md:block"
            >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm transition-all border border-white/10 group z-10 hidden md:block"
            >
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10 bg-slate-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                {images.map((_, index) => {
                    // Sliding window logic: show 5 indicators centered around current
                    // Calculate start and end of the window
                    let start = currentIndex - 2;
                    let end = currentIndex + 2;

                    // Adjust if out of bounds
                    if (start < 0) {
                        end += Math.abs(start);
                        start = 0;
                    }
                    if (end >= images.length) {
                        start -= (end - images.length + 1);
                        end = images.length - 1;
                    }

                    // Clamping start again in case total images < 5
                    start = Math.max(0, start);

                    if (index >= start && index <= end) {
                        return (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-white/50 hover:bg-white/80"
                                    }`}
                                title={`Go to slide ${index + 1}`}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
