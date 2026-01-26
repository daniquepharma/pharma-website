"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, Mail, Phone, Edit2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const [profile, setProfile] = useState({
        phone: "",
        address: {
            addressLine1: "",
            city: "",
            state: "",
            pincode: "",
        }
    });

    useEffect(() => {
        if (session?.user) {
            fetchProfile();
        }
    }, [session]);

    async function fetchProfile() {
        try {
            const res = await fetch("/api/user/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile({
                    phone: data.phone || "",
                    address: {
                        addressLine1: data.address?.addressLine1 || "",
                        city: data.address?.city || "",
                        state: data.address?.state || "",
                        pincode: data.address?.pincode || "",
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    }

    async function handleSave() {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                setMessage({ text: "Profile updated successfully!", type: "success" });
                setIsEditing(false);
            } else {
                setMessage({ text: "Failed to update profile", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "An error occurred", type: "error" });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        redirect("/auth/login");
    }

    const quickLinks = [
        { name: "My Orders", href: "/account/orders", icon: Package, color: "blue" },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex justify-between items-end"
                    >
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Account</h1>
                            <p className="text-slate-400">Manage your profile and preferences</p>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Profile & Edit Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
                        >
                            {/* Message Toast */}
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className={`absolute top-0 left-0 right-0 p-3 text-center text-sm font-bold ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            }`}
                                    >
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <User className="text-primary" size={24} />
                                    Profile Details
                                </h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                                    >
                                        <Edit2 size={14} /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="text-sm bg-slate-800 text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                                        >
                                            <X size={14} /> Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="text-sm bg-primary text-slate-900 font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? "Saving..." : <><Save size={14} /> Save Changes</>}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Full Name</label>
                                        <p className="text-white font-medium text-lg mt-1">{session.user.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email Address</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Mail size={16} className="text-slate-400" />
                                            <p className="text-white">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Account ID</label>
                                        <p className="text-slate-400 font-mono text-xs mt-1">#{session.user.email?.split('@')[0].toUpperCase()}</p>
                                    </div>
                                </div>

                                {/* Editable Fields */}
                                <div className="space-y-4 border-l border-slate-800 pl-8 md:pl-8">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-2">Phone Number</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                                placeholder="Enter phone number"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-slate-400" />
                                                <p className="text-white">{profile.phone || "Not set"}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-2">Delivery Address</label>
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={profile.address.addressLine1}
                                                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, addressLine1: e.target.value } })}
                                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                                                    placeholder="Address Line 1"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={profile.address.city}
                                                        onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
                                                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                                                        placeholder="City"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={profile.address.state}
                                                        onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })}
                                                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                                                        placeholder="State"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profile.address.pincode}
                                                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, pincode: e.target.value } })}
                                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                                                    placeholder="Pincode"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-2">
                                                <MapPin size={16} className="text-slate-400 mt-1 min-w-[16px]" />
                                                <p className="text-white text-sm leading-relaxed">
                                                    {profile.address.addressLine1 ? (
                                                        <>
                                                            {profile.address.addressLine1}<br />
                                                            {profile.address.city}, {profile.address.state} - {profile.address.pincode}
                                                        </>
                                                    ) : "No address set"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <div className="md:col-span-1 space-y-4">
                            {quickLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="block bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 bg-${link.color}-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <link.icon className={`text-${link.color}-500`} size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                                    {link.name}
                                                </h3>
                                                <p className="text-slate-400 text-sm">
                                                    View History
                                                </p>
                                            </div>
                                            <div className="text-slate-600 group-hover:text-primary transition-colors">
                                                →
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-white font-bold mb-2">Need Help?</h3>
                                <p className="text-slate-400 text-sm mb-4">Contact our support team for any queries regarding your orders.</p>
                                <Link href="/contact" className="text-primary text-sm font-bold hover:underline">
                                    Contact Support →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
