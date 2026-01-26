"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@prisma/client";
import { CheckCircle, Minus, Pill, Plus, ShoppingCart, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import FormattedDescription from "./FormattedDescription";

export default function ProductDetails({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(product.images && product.images.length > 0 ? product.images[0] : "");

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
        <div className="space-y-8">
            {/* Top Section: Product Info & Purchase Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Product Image Gallery */}
                <div className="flex flex-col md:flex-row-reverse gap-4">
                    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-8 flex items-center justify-center h-[400px] md:h-[500px] flex-1 relative">
                        {product.images && product.images.length > 0 ? (
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-contain max-h-[400px]"
                            />
                        ) : (
                            <div className="text-slate-700">
                                <Pill size={120} />
                            </div>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 md:flex-col md:w-24 md:h-[500px] md:overflow-y-auto md:pb-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? "border-primary" : "border-slate-800 hover:border-slate-600"
                                        }`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details & Actions */}
                <div className="space-y-6">
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
                            <span className="text-5xl font-bold text-white">₹{product.price.toFixed(2)}</span>
                            <span className="text-slate-500 mb-2 text-lg line-through">₹{(product.price * 1.2).toFixed(2)}</span>
                            <span className="text-green-500 mb-2 text-lg font-medium">20% OFF</span>
                        </div>
                        <p className="text-slate-400 text-sm">Inclusive of all taxes</p>

                        {/* Stock Status - Show "Only X left" when stock is low (<=10) */}
                        <div className="flex items-center gap-2">
                            {product.stock <= 0 ? (
                                <span className="inline-flex items-center gap-1 text-red-500 text-sm font-medium">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Out of Stock
                                </span>
                            ) : product.stock <= 10 ? (
                                <span className="inline-flex items-center gap-1 text-yellow-500 text-sm font-medium">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                    Only {product.stock} left!
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 w-fit">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={product.stock <= 0}
                                className="p-3 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="w-12 text-center text-white font-bold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                disabled={product.stock <= 0 || quantity >= product.stock}
                                className="p-3 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${product.stock <= 0
                                ? "bg-slate-700 text-slate-400 cursor-not-allowed opacity-50"
                                : added
                                    ? "bg-green-600 text-white"
                                    : "bg-primary text-slate-950 hover:bg-primary/90"
                                }`}
                        >
                            {added ? (
                                <>
                                    <CheckCircle size={24} /> Added to Cart
                                </>
                            ) : product.stock <= 0 ? (
                                <>
                                    Out of Stock
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={24} /> Add to Cart
                                </>
                            )}
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4">
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

            {/* Bottom Section: Description */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Product Description</h3>
                <FormattedDescription content={product.description} />
            </div>
        </div>
    );
}
