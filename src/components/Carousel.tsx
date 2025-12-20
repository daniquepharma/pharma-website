"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/HomePhotos/pic1.jpeg",
  "/HomePhotos/pic2.jpg",
  "/HomePhotos/pic3.png",
  "/HomePhotos/pic4.jpg",
  "/HomePhotos/pic5.png",
  "/HomePhotos/pic6.jpg",
  "/HomePhotos/pic7.jpg",
  "/HomePhotos/pic8.jpg",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + images.length) % images.length);
    setAutoplay(false);
  };

  useEffect(() => {
    if (!autoplay) {
      const timer = setTimeout(() => setAutoplay(true), 5000);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <section className="relative w-full bg-slate-950 overflow-hidden py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={images[current]}
                alt={`Slide ${current + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </AnimatePresence>

      {/* Left Arrow */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => paginate(-1)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-40 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all duration-300 group"
      >
        <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => paginate(1)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-40 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-all duration-300 group"
      >
        <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Dot Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-40 flex gap-3"
      >
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
              setAutoplay(false);
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-300 rounded-full backdrop-blur-md ${
              index === current
                ? "bg-white w-8 h-2"
                : "bg-white/40 w-2 h-2 hover:bg-white/70"
            }`}
          />
        ))}
      </motion.div>

      {/* Counter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 z-40 text-white text-xs font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-md"
      >
        {current + 1} / {images.length}
      </motion.div>
        </div>

        {/* Image Title/Description */}
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-2">Danique Pharma</h3>
          <p className="text-lg text-white/80">Premium Pharmaceutical Products</p>
        </motion.div>

        {/* Dots below carousel */}
        <div className="flex justify-center gap-2 mt-8">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 transition-all duration-300 ${
                index === current ? "bg-primary w-8" : "bg-white/30 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
