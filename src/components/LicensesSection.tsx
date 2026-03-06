"use client";

import { FileText } from "lucide-react";

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

                <div className="space-y-12">
                    {licenses.map((license, index) => (
                        <div
                            key={index}
                            className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="w-full flex items-center p-6 bg-slate-900 border-b border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <FileText className="text-primary" size={24} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-bold text-white">
                                            {license.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* PDF Viewer - Always Visible */}
                            <div className="p-6 bg-slate-900">
                                <div className="bg-slate-950 rounded-lg overflow-hidden shadow-inner">
                                    <iframe
                                        src={`/api/uploads/license/${encodeURIComponent(license.filename)}`}
                                        className="w-full h-[600px] border-0"
                                        title={license.title}
                                    />
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <a
                                        href={`/api/uploads/license/${encodeURIComponent(license.filename)}`}
                                        download
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-slate-950 font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/20"
                                    >
                                        <FileText size={20} />
                                        Download {license.title}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
