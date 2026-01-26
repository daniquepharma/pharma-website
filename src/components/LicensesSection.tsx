"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface License {
    title: string;
    filename: string;
}

const licenses: License[] = [
    { title: "DANIQUE Formulations License 1", filename: "DANIQ 1.pdf" },
    { title: "DANIQUE Formulations License 2", filename: "DANIQ 2pdf.pdf" },
    { title: "M/s LAKRA POLYTEX Certificate", filename: "M s LAKRA POLYTEX Certificate.pdf" },
    { title: "Company License", filename: "license.pdf" },
];

export default function LicensesSection() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleLicense = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section className="bg-slate-900 py-16">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                        Licenses & Certificates
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Our official certifications and regulatory compliance documents
                    </p>
                </div>

                <div className="space-y-4">
                    {licenses.map((license, index) => (
                        <div
                            key={index}
                            className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden"
                        >
                            {/* Dropdown Header */}
                            <button
                                onClick={() => toggleLicense(index)}
                                className="w-full flex items-center justify-between p-6 hover:bg-slate-900 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <FileText className="text-primary" size={24} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-bold text-white">
                                            {license.title}
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Click to {expandedIndex === index ? "collapse" : "view"} document
                                        </p>
                                    </div>
                                </div>
                                <div className="text-slate-400">
                                    {expandedIndex === index ? (
                                        <ChevronDown size={24} />
                                    ) : (
                                        <ChevronRight size={24} />
                                    )}
                                </div>
                            </button>

                            {/* PDF Viewer */}
                            <AnimatePresence>
                                {expandedIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-slate-800 p-6 bg-slate-900">
                                            <div className="bg-slate-950 rounded-lg overflow-hidden">
                                                <iframe
                                                    src={`/uploads/license/${encodeURIComponent(license.filename)}`}
                                                    className="w-full h-[600px] border-0"
                                                    title={license.title}
                                                />
                                            </div>
                                            <div className="mt-4 flex justify-center">
                                                <a
                                                    href={`/uploads/license/${encodeURIComponent(license.filename)}`}
                                                    download
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-slate-950 font-bold rounded-lg hover:bg-primary/90 transition-colors"
                                                >
                                                    <FileText size={20} />
                                                    Download {license.title}
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
