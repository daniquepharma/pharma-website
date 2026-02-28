"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, Package, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
];

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

function NavbarContent() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { data: session, status } = useSession();
    const userMenuRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Sync search query with URL parameters
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
    }, [searchParams]);

    // Close user menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
        }
    };



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
                        <Link href="/" className="flex items-center gap-3 group">
                            <img
                                src="/uploads/logo/company-logo.png"
                                alt="DANIQUE FORMULATIONS Logo"
                                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                            />
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

                        {/* Search Bar */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="p-2 text-slate-300 hover:text-primary transition-colors"
                            >
                                <Search size={20} />
                            </button>
                            <AnimatePresence>
                                {showSearch && (
                                    <motion.form
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        onSubmit={handleSearch}
                                        className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-800 rounded-lg p-2 shadow-xl flex gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search medicines..."
                                            className="flex-1 bg-slate-800 text-white text-sm rounded-md px-3 py-2 border border-slate-700 focus:outline-none focus:border-primary"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            className="bg-primary text-slate-950 p-2 rounded-md hover:bg-primary/90 transition-colors"
                                        >
                                            <Search size={16} />
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>


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

                        {/* User Menu */}
                        {status === "loading" ? (
                            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse"></div>
                        ) : session?.user ? (
                            <div ref={userMenuRef} className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    {session.user.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-slate-950 font-bold">
                                            {session.user.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-slate-800">
                                                <p className="text-white font-medium">{session.user.name}</p>
                                                <p className="text-slate-400 text-sm truncate">{session.user.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    href="/account"
                                                    className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <User size={18} />
                                                    My Account
                                                </Link>
                                                <Link
                                                    href="/account/orders"
                                                    className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <Package size={18} />
                                                    Orders
                                                </Link>

                                            </div>
                                            <div className="border-t border-slate-800">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors w-full"
                                                >
                                                    <LogOut size={18} />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/login"
                                    className="text-sm fontmedium text-slate-300 hover:text-primary transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-primary text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="text-slate-300 hover:text-primary transition-colors p-2"
                        >
                            <Search size={22} />
                        </button>
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

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-white/10 p-4 sm:p-6"
                    >
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:border-primary"
                            />
                            <button type="submit" className="bg-primary text-slate-950 px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                                <Search size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

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

                            {session?.user ? (
                                <>
                                    <div className="border-t border-slate-800 my-2 pt-2">
                                        <p className="px-3 py-2 text-white font-medium">{session.user.name}</p>
                                    </div>
                                    <Link
                                        href="/account"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        My Account
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        Orders
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleSignOut();
                                        }}
                                        className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="border-t border-slate-800 my-2 pt-2 space-y-1">
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-3 rounded-md text-base font-medium bg-primary text-slate-950 hover:bg-primary/90 transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-lg" />}>
            <NavbarContent />
        </Suspense>
    );
}
