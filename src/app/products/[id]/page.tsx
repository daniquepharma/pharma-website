import { getProductById } from "@/app/actions";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <ProductDetails product={product} />
            </div>
            <Footer />
        </main>
    );
}
