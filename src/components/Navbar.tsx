"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
];

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-slate-950 shadow-lg group-hover:scale-105 transition-transform">
                                <Pill className="w-6 h-6" />
                            </div>
                            <span className="font-heading font-bold text-xl tracking-wide text-white group-hover:text-primary transition-colors">
                                DANIQUE <span className="text-primary">FORMULATIONS</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-300 hover:text-primary transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}

                        <Link href="/checkout" className="relative group">
                            <div className="p-2 text-slate-300 hover:text-primary transition-colors">
                                <ShoppingCart size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-primary text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <Link href="/checkout" className="relative text-slate-300 hover:text-primary">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-200 hover:text-primary transition-colors p-2"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-primary hover:bg-white/5 transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
