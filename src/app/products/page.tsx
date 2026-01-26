import Products from "@/components/Products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProducts } from "../actions";



export default async function ProductsPage(props: {
    searchParams?: Promise<{
        search?: string;
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const search = searchParams?.search;
    const category = searchParams?.category;
    const sort = searchParams?.sort;
    const products = await getProducts({
        search,
        category,
        sort
    });

    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-24">
                <Products products={products} />
            </div>
            <Footer />
        </main>
    );
}
