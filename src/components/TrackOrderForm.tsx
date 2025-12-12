"use client";

import { getOrderById } from "@/app/actions";
import { Order, OrderItem, Product } from "@prisma/client";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type OrderWithItems = Order & {
    items: (OrderItem & {
        product: Product;
    })[];
};

export default function TrackOrderForm() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState<OrderWithItems | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const result = await getOrderById(orderId.trim());
            if (result) {
                setOrder(result as OrderWithItems);
            } else {
                setError("Order not found. Please check the ID and try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStepStatus = (step: string, currentStatus: string) => {
        const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
        const currentIndex = statuses.indexOf(currentStatus);
        const stepIndex = statuses.indexOf(step);

        if (currentStatus === "CANCELLED") return "cancelled";
        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "upcoming";
    };

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleTrack} className="flex gap-2 mb-12">
                <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors font-mono"
                />
                <button
                    type="submit"
                    disabled={loading || !orderId}
                    className="bg-primary text-slate-950 font-bold px-8 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    {loading ? "..." : "Track"}
                </button>
            </form>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {order && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-left"
                >
                    <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Order Status</h3>
                            <p className="text-slate-400 text-sm">ID: {order.id}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-primary font-bold text-lg">{order.status}</span>
                            <p className="text-slate-500 text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Stepper */}
                    {order.status !== "CANCELLED" ? (
                        <div className="relative flex justify-between mb-12 px-2">
                            {/* Progress Line */}
                            <div className="absolute top-4 left-0 w-full h-1 bg-slate-800 -z-0"></div>

                            {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].map((step, i) => {
                                const status = getStepStatus(step, order.status);
                                let color = "bg-slate-800 border-slate-600 text-slate-500";
                                if (status === "completed") color = "bg-green-500 border-green-500 text-green-500";
                                if (status === "current") color = "bg-primary border-primary text-primary shadow-[0_0_15px_rgba(34,211,238,0.4)]";

                                return (
                                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${color} bg-slate-950 transition-all duration-500`}>
                                            {status === "completed" && <CheckCircle size={14} className="text-green-500" />}
                                            {status === "current" && <div className="w-2 h-2 rounded-full bg-primary" />}
                                        </div>
                                        <span className={`text-xs font-medium uppercase tracking-wider ${status === 'upcoming' ? 'text-slate-600' : 'text-slate-300'}`}>
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-red-400 bg-red-500/5 rounded-xl border border-red-500/10 mb-8">
                            This order has been cancelled.
                        </div>
                    )}

                    <div className="space-y-4">
                        <h4 className="font-medium text-white border-b border-slate-800 pb-2">Order Items</h4>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-slate-300">
                                    {item.quantity}x {item.product.name}
                                </span>
                                <span className="text-white font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-800 font-bold">
                            <span className="text-white">Total</span>
                            <span className="text-primary text-lg">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
