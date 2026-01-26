"use client";

import { motion } from "framer-motion";
import { Building2, Target, Eye, Heart, Pill, Package } from "lucide-react";

export default function About() {
    return (
        <div className="bg-slate-950">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-4 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
                            About <span className="text-primary">DANIQUE FORMULATIONS</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Our tag &quot;Healing Hands, Caring Hearts&quot; is not just a slogan; it&apos;s our promise of compassion and transforming lives through innovative healthcare.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* History Section */}
            <section className="py-16 bg-slate-900">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="text-primary" size={24} />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-white">Our History</h2>
                    </div>
                    <div className="space-y-6 text-slate-300 leading-relaxed">
                        <p className="text-lg">
                            Established with a clear vision – to make quality medicines accessible and affordable for all. What started as a mission-driven initiative has grown into a trusted name in pharmaceutical excellence.
                        </p>
                        <p className="text-lg">
                            The name &quot;Danique&quot; means &quot;God is my Judge,&quot; reflecting our core principle that our work is ultimately answered to a higher calling.ess the most pressing healthcare needs. Over time, our commitment to quality and innovation helped us build a strong foundation in the pharmaceutical industry.
                        </p>
                        <p className="text-lg">
                            Through dedicated efforts, we successfully expanded operations beyond our regional presence, reaching pan-India and international markets. Each milestone reflects our unwavering dedication to healthcare advancement.
                        </p>
                        <p className="text-lg">
                            Today, we stand as a progressive pharmaceutical company, serving healthcare professionals and patients with high-quality, affordable, and innovative medical solutions that make a real difference in people&apos;s lives.
                        </p>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Vision */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Eye className="text-blue-500" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                            </div>
                            <p className="text-primary font-semibold mb-4 text-lg">
                                &quot;To be a globally respected pharmaceutical company, recognized for delivering innovative, affordable, and high-quality healthcare solutions that improve lives.&quot;
                            </p>
                            <div className="space-y-3 text-slate-300">
                                <p className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Lead through research, innovation, and excellence in healthcare</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Make medicines accessible and affordable for every community we serve</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Build long-term trust with healthcare professionals, patients, and partners</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Contribute towards a healthier and happier world through sustainable growth and ethical practices</span>
                                </p>
                            </div>
                        </div>

                        {/* Mission */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                                    <Target className="text-green-500" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                            </div>
                            <p className="text-primary font-semibold mb-4 text-lg">
                                &quot;To deliver innovative, affordable, and high-quality healthcare solutions that transform lives globally.&quot;
                            </p>
                            <div className="space-y-3 text-slate-300">
                                <p className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Lead through research, innovation, and excellence in healthcare</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Make medicines accessible and affordable for every community we serve</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Build long-term trust with healthcare professionals, patients, and partners</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>Contribute towards a healthier and happier world through sustainable growth and ethical practices</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Therapeutic Areas & Products */}
            <section className="py-16 bg-slate-900">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Therapeutic Areas */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Heart className="text-primary" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Therapeutic Areas</h3>
                            </div>
                            <div className="space-y-3">
                                {['Orthopedic', 'Gynecology', 'Physician', 'Other Specialty'].map((area) => (
                                    <div key={area} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span className="text-slate-200 font-medium">{area}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Categories */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                                    <Package className="text-orange-500" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Product Categories</h3>
                            </div>
                            <div className="space-y-3">
                                {['Tablets', 'Capsules', 'Syrups', 'Injections', 'Capsule Gel'].map((category) => (
                                    <div key={category} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg">
                                        <Pill className="text-orange-500" size={18} />
                                        <span className="text-slate-200 font-medium">{category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Featured Products */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Featured Products</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['SLATY-OD', 'WELLAROZ FORTE', 'DANIQUE D3 60K', 'PENTRYP-NT'].map((product) => (
                                <div key={product} className="bg-slate-900 p-4 rounded-lg text-center">
                                    <Pill className="text-primary mx-auto mb-2" size={24} />
                                    <p className="text-slate-200 font-medium text-sm">{product}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
