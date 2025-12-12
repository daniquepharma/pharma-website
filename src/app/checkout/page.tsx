
"use client";

import { useCart } from "@/context/CartContext";
import { createOrder } from "../actions";
import { useState } from "react";
import Link from "next/link";
import { Trash2, ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);

        try {
            const result = await createOrder({
                customerName: formData.get("name") as string,
                customerEmail: formData.get("email") as string,
                address: formData.get("address") as string,
                total: cartTotal,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            if (result.success) {
                setOrderId(result.orderId);
                clearCart();
            }
        } catch (error) {
            console.error("Order failed", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (orderId) {
        return (
            <main className="bg-slate-950 min-h-screen">
                <Navbar />
                <div className="pt-32 pb-20 px-4">
                    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
                        <p className="text-slate-400 mb-6">
                            Thank you for your order. Your order ID is <span className="font-mono text-primary">{orderId.slice(0, 8)}</span>.
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-primary text-slate-950 font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <Link
                            href="/products"
                            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Shop
                        </Link>
                        <h1 className="text-3xl font-heading font-bold text-white">Checkout</h1>
                    </div>

                    {cart.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                            <p className="text-slate-400 mb-6 text-lg">Your cart is empty.</p>
                            <Link
                                href="/products"
                                className="inline-block bg-primary text-slate-950 font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Cart Items */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white">Your Items</h2>
                                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                    <div className="divide-y divide-slate-800">
                                        {cart.map((item) => (
                                            <div key={item.id} className="p-4 flex gap-4 items-center">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-slate-950" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-slate-800 rounded flex items-center justify-center text-slate-500 text-xs">No Img</div>
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-white">{item.name}</h3>
                                                    <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-slate-500 hover:text-red-400 text-sm mt-1 flex items-center gap-1 ml-auto"
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-6 bg-slate-800/50 border-t border-slate-800 flex justify-between items-center">
                                        <span className="text-slate-400 font-medium">Total</span>
                                        <span className="text-2xl font-bold text-white">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Form */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white">Shipping Details</h2>
                                <form action={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Shipping Address</label>
                                        <textarea
                                            name="address"
                                            required
                                            rows={3}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-primary text-slate-950 font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? "Processing..." : `Pay $${cartTotal.toFixed(2)} & Place Order`}
                                        </button>
                                        <p className="text-center text-xs text-slate-500 mt-4">
                                            Secure connection. Payment is simulated for this demo.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
