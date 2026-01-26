"use client";

import Section from "./Section";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function Contact() {
    return (
        <Section id="contact" className="bg-slate-950">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Info & Map */}
                <div>
                    <h2 className="text-primary font-medium tracking-wider uppercase mb-2">Get in Touch</h2>
                    <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-8">
                        Contact Us
                    </h3>

                    <div className="space-y-8 mb-12">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Visit Us</h4>
                                <p className="text-slate-400 leading-relaxed">
                                    326, Third Floor, Vardhman Jaypee Plaza,<br /> New Delhi - 110075
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Call Us</h4>
                                <p className="text-slate-400">
                                    +91 93106 75469 <br />
                                    +91 70651 00000
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Email Us</h4>
                                <p className="text-slate-400">
                                    daniqueformulations@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="w-full h-96 rounded-2xl overflow-hidden grayscale border border-white/10 relative bg-slate-900">
                        {/* Google Maps Embed would go here. Using a placeholder for now as requested by user status "ALREADY REGISTERED ON GOOGLE MAPS" */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.626777611599!2d77.0682!3d28.5805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1b1a1a1a1a1a%3A0x1a1a1a1a1a1a1a1a!2sVardhman%20Jaypee%20Plaza!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="opacity-70 hover:opacity-100 transition-opacity"
                        ></iframe>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 md:p-10">
                    <h4 className="text-2xl font-heading font-bold text-white mb-6">Send Message</h4>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Name</label>
                                <input type="text" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Phone</label>
                                <input type="tel" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="+91 ..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Email</label>
                            <input type="email" className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Message</label>
                            <textarea rows={4} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="How can we help you?" />
                        </div>
                        <button type="button" className="w-full bg-primary text-slate-950 font-bold rounded-xl py-4 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                            Send Message
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </Section>
    );
}
