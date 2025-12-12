"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@prisma/client";
import { CheckCircle, Minus, Pill, Plus, ShoppingCart, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductDetails({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images[0]
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-8 flex items-center justify-center h-[400px] md:h-[500px]">
                    {product.images && product.images.length > 0 ? (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain max-h-[400px]"
                        />
                    ) : (
                        <div className="text-slate-700">
                            <Pill size={120} />
                        </div>
                    )}
                </div>
                {/* Thumbnails (Placeholder for now as we only have 1 image usually) */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {product.images && product.images.map((img, i) => (
                        <div key={i} className="w-20 h-20 bg-slate-900 rounded-lg border border-primary/50 overflow-hidden cursor-pointer flex-shrink-0">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: details */}
            <div className="space-y-8">
                <div>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-4 font-medium tracking-wide">
                        {product.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                        {product.name}
                    </h1>
                    <p className="text-xl text-slate-400 font-light">
                        {product.category} | SKU: {product.id.slice(0, 8).toUpperCase()}
                    </p>
                </div>

                <div className="border-t border-b border-slate-800 py-6 space-y-4">
                    <div className="flex items-end gap-4">
                        <span className="text-5xl font-bold text-white">${product.price.toFixed(2)}</span>
                        <span className="text-slate-500 mb-2 text-lg line-through">${(product.price * 1.2).toFixed(2)}</span>
                        <span className="text-green-500 mb-2 text-lg font-medium">20% OFF</span>
                    </div>
                    <p className="text-slate-400 text-sm">Inclusive of all taxes</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Description</h3>
                    <p className="text-slate-300 leading-relaxed text-lg">
                        {product.description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 w-fit">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="p-3 text-slate-400 hover:text-white transition-colors"
                        >
                            <Minus size={20} />
                        </button>
                        <span className="w-12 text-center text-white font-bold text-lg">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="p-3 text-slate-400 hover:text-white transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${added
                                ? "bg-green-600 text-white"
                                : "bg-primary text-slate-950 hover:bg-primary/90"
                            }`}
                    >
                        {added ? (
                            <>
                                <CheckCircle size={24} /> Added to Cart
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={24} /> Add to Cart
                            </>
                        )}
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                    <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-900/50 rounded-xl">
                        <Truck className="text-primary" size={24} />
                        <span className="text-xs text-slate-300">Fast Delivery</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-900/50 rounded-xl">
                        <ShieldCheck className="text-primary" size={24} />
                        <span className="text-xs text-slate-300">Genuine Products</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-900/50 rounded-xl">
                        <RefreshCw className="text-primary" size={24} />
                        <span className="text-xs text-slate-300">Easy Returns</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
