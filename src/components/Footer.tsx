import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="font-heading font-bold text-2xl text-white mb-4">
                            DANIQUE <span className="text-primary">FORMULATIONS</span>
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Empowering healthcare with innovative, accessible, and high-quality medicines.
                            Healing Hands, Caring Hearts.
                        </p>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-slate-950 transition-all"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-lg text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {["Home", "About Us", "Our Vision", "Products", "Contact Us"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Therapeutic Areas */}
                    <div>
                        <h4 className="font-heading font-bold text-lg text-white mb-6">Therapeutic Areas</h4>
                        <ul className="space-y-3">
                            {["Orthopedic", "Gynaecology", "Physician", "Speciality Care"].map((item) => (
                                <li key={item} className="text-slate-400 text-sm">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading font-bold text-lg text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-slate-400 text-sm">
                                    326, Third Floor, Vardhman Jaypee Plaza, New Delhi - 110075
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div className="flex flex-col gap-1">
                                    <a href="tel:+919310675469" className="text-slate-400 text-sm hover:text-primary transition-colors">
                                        +91 93106 75469
                                    </a>
                                    <a href="tel:+917065100000" className="text-slate-400 text-sm hover:text-primary transition-colors">
                                        +91 70651 00000
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="mailto:daniqueformulations@gmail.com" className="text-slate-400 text-sm hover:text-primary transition-colors">
                                    daniqueformulations@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} Danique Formulations. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-slate-500 hover:text-primary text-xs transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-slate-500 hover:text-primary text-xs transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
