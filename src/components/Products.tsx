"use client";

import Section from "./Section";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tablet, Syringe, Pill, Beaker, CheckCircle, ShoppingCart, Search, Filter, X } from "lucide-react";
import { Product } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
    { name: "Tablets", icon: Tablet, count: "20+" },
    { name: "Capsules", icon: Pill, count: "15+" },
    { name: "Injections", icon: Syringe, count: "10+" },
    { name: "Syrups", icon: Beaker, count: "12+" },
    { name: "Gels", icon: CheckCircle, count: "5+" },
];

export default function Products({ products = [] }: { products?: Product[] }) {
    const { addToCart } = useCart();
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter States
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setCategory(searchParams.get("category") || "");
        setSort(searchParams.get("sort") || "newest");
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (searchParams.get("search") || "")) {
                const params = new URLSearchParams(searchParams.toString());
                if (search) {
                    params.set("search", search);
                } else {
                    params.delete("search");
                }
                router.push(`/products?${params.toString()}`);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, router, searchParams]);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/products");
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0]
        });

        // Brief visual feedback
        setAddedIds(prev => new Set(prev).add(product.id));
        setTimeout(() => {
            setAddedIds(prev => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
        }, 2000);
    };

    return (
        <Section id="products" className="bg-slate-900 min-h-screen !py-8">
            {/* Prominent Search Bar - Moved to Top */}
            <div className="max-w-3xl mx-auto mb-12">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-500 shadow-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'fixed inset-0 z-50 bg-slate-900 p-4 overflow-y-auto' : 'hidden lg:block'}`}>
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                        <h2 className="text-xl font-bold text-white">Filters</h2>
                        <button onClick={() => setShowFilters(false)} className="text-slate-400">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Categories */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={category === ""}
                                        onChange={() => handleFilterChange("category", "")}
                                        className="accent-primary"
                                    />
                                    All Categories
                                </label>
                                {categories.map((cat) => (
                                    <label key={cat.name} className="flex items-center gap-3 text-slate-400 hover:text-primary cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={category === cat.name}
                                            onChange={() => handleFilterChange("category", cat.name)}
                                            className="accent-primary"
                                        />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reset Filters */}
                        {(category !== "") && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-2 border border-slate-700 text-slate-400 hover:text-white hover:border-white rounded-lg transition-colors text-sm"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-3xl font-heading font-bold text-white mb-2">
                                    All Products
                                </h2>
                                <p className="text-slate-400">
                                    Showing {products.length} results
                                </p>
                            </div>

                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="lg:hidden flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg"
                                >
                                    <Filter size={18} /> Filters
                                </button>

                                <select
                                    value={sort}
                                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                                    className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="name_asc">Name: A to Z</option>
                                    <option value="name_desc">Name: Z to A</option>
                                </select>
                            </div>
                        </div>


                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => router.push(`/products/${product.id}`)}
                                className="group relative bg-slate-950 border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-primary/50 transition-colors flex flex-col cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Pill size={80} />
                                </div>
                                <div className="relative z-10 flex-1">
                                    {/* Product Image */}
                                    <div className="block relative h-48 w-full mb-4 rounded-xl overflow-hidden bg-slate-900 group-hover:bg-slate-800 transition-colors">
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                <Pill size={48} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-md mb-4 font-medium">
                                        {product.category}
                                    </span>
                                    <div>
                                        <h5 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                            {product.name}
                                        </h5>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="relative z-10 mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                                    <span className="text-lg font-bold text-white">₹{product.price.toFixed(2)}</span>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${addedIds.has(product.id)
                                            ? "bg-green-600 text-white"
                                            : "bg-primary text-slate-950 hover:bg-primary/90"
                                            }`}
                                    >
                                        {addedIds.has(product.id) ? (
                                            <>
                                                <CheckCircle size={16} /> Added
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={16} /> Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                                <Search className="mx-auto mb-4 opacity-50" size={48} />
                                <p className="text-lg font-medium">No products found matching your filters.</p>
                                <button onClick={clearFilters} className="mt-4 text-primary hover:underline">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Section>
    );
}
