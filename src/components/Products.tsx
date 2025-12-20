"use client";

import Section from "./Section";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tablet, Syringe, Pill, Beaker, CheckCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

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
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddToCart = (product: Product) => {
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
        <Section id="products" className="bg-slate-900">
            <div className="text-center mb-16">
                <h2 className="text-primary font-medium tracking-wider uppercase mb-2">Our Portfolio</h2>
                <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                    Pharmaceutical Excellence
                </h3>
            </div>

            {/* Categories Grid - Keeping as visual element */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-20">
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.name}
                        whileHover={{ y: -5 }}
                        className="bg-slate-800/50 border border-white/5 rounded-xl p-6 text-center hover:bg-slate-800 hover:border-primary/30 transition-all cursor-pointer group"
                    >
                        <div className="w-12 h-12 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-4">
                            <cat.icon size={24} />
                        </div>
                        <h4 className="text-white font-medium mb-1">{cat.name}</h4>
                        <span className="text-xs text-slate-500">{cat.count} Variants</span>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h4 className="text-2xl font-heading font-bold text-white border-l-4 border-primary pl-4">
                    Available Products
                </h4>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-primary text-slate-950" : "text-slate-400 hover:text-white"}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-slate-950" : "text-slate-400 hover:text-white"}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid/List */}
            <div className={viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }>
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative bg-slate-950 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors flex ${viewMode === "grid" ? "flex-col p-6" : "flex-row p-4 items-center gap-6"}`}
                    >
                        {viewMode === "grid" && (
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Pill size={80} />
                            </div>
                        )}

                        {/* Product Image */}
                        <div className={viewMode === "grid" ? "relative z-10 flex-1 mb-4" : "relative z-10 w-48 h-32 flex-shrink-0"}>
                            <Link href={`/products/${product.id}`} className={`block relative rounded-xl overflow-hidden bg-slate-900 group-hover:bg-slate-800 transition-colors ${viewMode === "grid" ? "h-48 w-full" : "h-full w-full"}`}>
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
                            </Link>
                        </div>

                        {/* Details */}
                        <div className={`relative z-10 flex-1 ${viewMode === "list" && "flex flex-col justify-center"}`}>
                            {viewMode === "grid" && (
                                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-md mb-4 font-medium">
                                    {product.category}
                                </span>
                            )}
                            <Link href={`/products/${product.id}`}>
                                <h5 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                    {product.name}
                                </h5>
                            </Link>
                            <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                {product.description}
                            </p>

                            {viewMode === "list" && (
                                <div className="flex items-center gap-4 mt-auto">
                                    <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className={`relative z-10 mt-auto flex items-center justify-between ${viewMode === "grid" ? "border-t border-slate-800 pt-4" : "ml-auto"}`}>
                            {viewMode === "grid" && <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>}

                            <button
                                onClick={() => handleAddToCart(product)}
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
                {filteredProducts.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        {products.length === 0 ? "No products available yet." : "No products match your search."}
                    </div>
                )}
            </div>
        </Section>
    );
}
