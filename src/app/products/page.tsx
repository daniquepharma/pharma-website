import Products from "@/components/Products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import fs from "fs";
import path from "path";
import { Product } from "@/components/Products";

export const dynamic = "force-dynamic";

async function getLocalProducts(): Promise<Product[]> {
    const productsDirectory = path.join(process.cwd(), "public/Medicine");

    try {
        const filenames = await fs.promises.readdir(productsDirectory);

        const products = filenames
            .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .map((file, index) => {
                const name = file.replace(/\.[^/.]+$/, "").replace(/-/g, " "); // Remove extension and replace dashes
                const slug = name.toLowerCase().replace(/\s+/g, '-');

                return {
                    id: slug,
                    name: name,
                    description: `${name} - High quality pharmaceutical product suitable for various treatments.`,
                    price: 29.99 + (index * 5), // Variable dummy price
                    stock: 100,
                    category: "General Medicine",
                    images: [`/Medicine/${file}`],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
            });

        return products;
    } catch (error) {
        console.error("Error reading medicine directory:", error);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getLocalProducts();

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
