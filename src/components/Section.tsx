import { ReactNode } from "react";

interface SectionProps {
    id?: string;
    className?: string;
    children: ReactNode;
}

export default function Section({ id, className = "", children }: SectionProps) {
    return (
        <section id={id} className={`py-20 md:py-28 relative ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {children}
            </div>
        </section>
    );
}
