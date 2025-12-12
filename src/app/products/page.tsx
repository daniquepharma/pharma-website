import Products from "@/components/Products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProducts } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-20">
                <Products products={products} />
            </div>
            <Footer />
        </main>
    );
}
