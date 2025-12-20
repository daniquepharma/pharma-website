"use client";

import Section from "./Section";
import { motion } from "framer-motion";
import { Target, History, Globe, FileText } from "lucide-react";

export default function About() {
    return (
        <Section id="about" className="bg-slate-950 border-t border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-primary font-medium tracking-wider uppercase mb-2">About Us</h2>
                        <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                            Empowering Health, <br /> Enriching Lives.
                        </h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            We are dedicated to transforming lives through innovative, high-quality, and affordable medicines.
                            From research and development to patient care, every step we take is guided by one purpose — empowering health.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <History size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Our History</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Established in 2010, starting with a clear vision to make quality medicines accessible.
                                    Expanded from regional operations to a pan-India presence.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Target size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Our Vision</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    To be a globally respected pharmaceutical company, listening to the needs of every community
                                    and contributing to a healthier world through ethical practices.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Global Reach</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Serving healthcare professionals and patients with a growing portfolio of high-quality formulations.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">Our License</h4>
                                <a
                                    href="/DANIQ 1.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    View Verified License
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual/Stats */}
                <div className="relative">
                    {/* Abstract visual representation instead of image since gen failed */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 p-8 flex flex-col justify-between">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shine_3s_infinite]" />

                        <div className="grid grid-cols-2 gap-4 h-full">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-center items-center border border-white/5"
                            >
                                <span className="text-4xl font-bold text-primary mb-2">15+</span>
                                <span className="text-slate-400 text-xs uppercase tracking-wide">Years of Excellence</span>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-center items-center border border-white/5 mt-8"
                            >
                                <span className="text-4xl font-bold text-white mb-2">4+</span>
                                <span className="text-slate-400 text-xs uppercase tracking-wide">Specialities</span>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-center items-center border border-white/5 -mt-8"
                            >
                                <span className="text-4xl font-bold text-white mb-2">50+</span>
                                <span className="text-slate-400 text-xs uppercase tracking-wide">Products</span>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col justify-center items-center border border-white/5"
                            >
                                <span className="text-4xl font-bold text-primary mb-2">Pan-India</span>
                                <span className="text-slate-400 text-xs uppercase tracking-wide">Presence</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
