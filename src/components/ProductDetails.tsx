"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@prisma/client";
import { CheckCircle, Minus, Pill, Plus, ShoppingCart, Truck, ShieldCheck, RefreshCw, Star, User } from "lucide-react";
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

    // Simple Markdown-like parser for description
    const renderDescription = (text: string) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3 border-l-4 border-primary pl-3">{line.replace('### ', '')}</h3>;
            }
            if (line.trim().startsWith('* ')) {
                const content = line.trim().replace('* ', '');
                const parts = content.split(/(\*\*.*?\*\*)/g);
                return (
                    <div key={index} className="flex gap-2 mb-2 ml-2">
                        <span className="text-primary mt-1.5">•</span>
                        <p className="text-slate-300 leading-relaxed">
                            {parts.map((part, j) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </p>
                    </div>
                );
            }
            // Paragraph handling
            if (line.trim().length === 0) return <br key={index} />;

            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={index} className="text-slate-300 leading-relaxed mb-2">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    const reviews = [
        { id: 1, user: "Sarah Jenkins", rating: 5, date: "2 days ago", content: "Amazing product! Really helped with my knee pain. I've been using it for a week and I feel a huge difference." },
        { id: 2, user: "Michael Chen", rating: 5, date: "1 week ago", content: "High quality and fast delivery. Defined recommend for anyone with joint issues." },
        { id: 3, user: "Emily R.", rating: 4, date: "2 weeks ago", content: "Good supplement, easy to swallow. Packaging was great." },
    ];

    return (
        <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column: Image Gallery */}
                <div className="space-y-4">
                    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-8 flex items-center justify-center h-[400px] md:h-[500px] relative group">
                        {product.images && product.images.length > 0 ? (
                            <motion.img
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-contain max-h-[400px] group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="text-slate-700">
                                <Pill size={120} />
                            </div>
                        )}
                        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-white">
                            Hover to zoom
                        </div>
                    </div>
                    {/* Thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                        {product.images && product.images.map((img, i) => (
                            <div key={i} className={`w-20 h-20 bg-slate-900 rounded-lg border-2 ${i === 0 ? 'border-primary' : 'border-slate-800 hover:border-slate-600'} overflow-hidden cursor-pointer flex-shrink-0 transition-colors`}>
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: details */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium tracking-wide">
                                {product.category}
                            </span>
                            <div className="flex items-center text-yellow-400 gap-1 text-sm">
                                <Star size={16} fill="currentColor" />
                                <span className="text-white font-medium">4.8</span>
                                <span className="text-slate-500">(124 reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-sm text-slate-500 font-mono">
                            SKU: {product.id.slice(0, 8).toUpperCase()}
                        </p>
                    </div>

                    <div className="border-t border-b border-slate-800 py-6 space-y-4">
                        <div className="flex items-end gap-4">
                            <span className="text-5xl font-bold text-white">${product.price.toFixed(2)}</span>
                            <span className="text-slate-500 mb-2 text-lg line-through">${(product.price * 1.2).toFixed(2)}</span>
                            <span className="text-green-500 mb-2 text-sm font-bold uppercase tracking-wider bg-green-500/10 px-2 py-1 rounded">20% OFF</span>
                        </div>
                        <p className="text-slate-400 text-sm">Inclusive of all taxes</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 w-fit">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="p-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="w-12 text-center text-white font-bold text-xl">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="p-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/20 ${added
                                ? "bg-green-600 text-white"
                                : "bg-primary text-slate-950 hover:bg-primary/90 hover:scale-[1.02]"
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

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                        <div className="bg-slate-900/30 p-6 rounded-xl border border-white/5">
                            {renderDescription(product.description)}
                        </div>
                    </div>



                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                            <Truck className="text-primary" size={24} />
                            <span className="text-xs font-medium text-slate-300">Fast Delivery</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                            <ShieldCheck className="text-primary" size={24} />
                            <span className="text-xs font-medium text-slate-300">Genuine</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                            <RefreshCw className="text-primary" size={24} />
                            <span className="text-xs font-medium text-slate-300">Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-slate-800 pt-16">
                <h3 className="text-3xl font-heading font-bold text-white mb-8">Customer Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-slate-900 p-6 rounded-xl border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{review.user}</h4>
                                        <span className="text-xs text-slate-500">{review.date}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-700" : ""} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">"{review.content}"</p>
                        </div>
                    ))}
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-900/80 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-primary/20 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium text-slate-300 group-hover:text-white">Write a Review</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
