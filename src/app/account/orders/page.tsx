"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronLeft, Calendar, DollarSign, ChevronDown, MapPin, User, AlertTriangle, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Order {
    id: string;
    createdAt: string;
    total: number;
    status: string;
    address: string;
    customerPhone: string;
    items: {
        productName: string;
        quantity: number;
        price: number;
    }[];
}

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    // Modal & Toast State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        if (session?.user) {
            fetchOrders();
        }
    }, [session]);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    async function fetchOrders() {
        try {
            const response = await fetch("/api/orders/user");
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    }

    function initiateCancel(orderId: string) {
        setOrderToCancel(orderId);
        setShowCancelModal(true);
    }

    async function confirmCancelOrder() {
        if (!orderToCancel) return;

        setCancellingOrderId(orderToCancel);
        setShowCancelModal(false); // Close modal immediately

        try {
            const response = await fetch(`/api/orders/${orderToCancel}/cancel`, {
                method: "POST",
            });

            if (response.ok) {
                await fetchOrders();
                setToast({ message: "Order cancelled successfully", type: "success" });
            } else {
                const error = await response.json();
                setToast({ message: error.error || "Failed to cancel order", type: "error" });
            }
        } catch (error) {
            console.error("Failed to cancel order:", error);
            setToast({ message: "Failed to cancel order", type: "error" });
        } finally {
            setCancellingOrderId(null);
            setOrderToCancel(null);
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 py-20 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <Link
                            href="/account"
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-primary transition-colors"
                        >
                            <ChevronLeft size={20} className="text-slate-300" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">My Orders</h1>
                            <p className="text-slate-400">View your order history and track orders</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center"
                        >
                            <Package className="mx-auto mb-4 text-slate-600" size={64} />
                            <h2 className="text-xl font-bold text-white mb-2">No orders yet</h2>
                            <p className="text-slate-400 mb-6">
                                You haven&apos;t placed any orders. Start shopping to see your orders here!
                            </p>
                            <Link
                                href="/products"
                                className="inline-block bg-primary text-slate-950 font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Browse Products
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
                                >
                                    {/* Order Header - Clickable */}
                                    <button
                                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                        className="w-full p-6 text-left hover:bg-slate-800/30 transition-colors"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <ChevronDown
                                                        size={20}
                                                        className={`text-primary transition-transform ${expandedOrderId === order.id ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                    <h3 className="text-lg font-bold text-white">
                                                        Order #{order.id.slice(0, 8)}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "DELIVERED"
                                                            ? "bg-green-500/10 text-green-500"
                                                            : order.status === "SHIPPED"
                                                                ? "bg-blue-500/10 text-blue-500"
                                                                : order.status === "PENDING"
                                                                    ? "bg-yellow-500/10 text-yellow-500"
                                                                    : order.status === "CONFIRMED"
                                                                        ? "bg-cyan-500/10 text-cyan-500"
                                                                        : order.status === "CANCELLED"
                                                                            ? "bg-red-500/10 text-red-500"
                                                                            : "bg-gray-500/10 text-gray-500"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-400 pl-8">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={16} />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Package size={16} />
                                                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">₹{order.total.toFixed(2)}</p>
                                                <p className="text-sm text-slate-400">Click to view details</p>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {expandedOrderId === order.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-t border-slate-800"
                                            >
                                                <div className="p-6 space-y-6">
                                                    {/* Full Order ID */}
                                                    <div>
                                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Order ID</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-white select-all bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 w-full text-sm">
                                                                {order.id}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Items */}
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                                            <Package size={16} className="text-primary" />
                                                            Order Items
                                                        </h4>
                                                        <div className="space-y-2 pl-6">
                                                            {order.items.map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex justify-between text-sm bg-slate-800/50 p-3 rounded-lg"
                                                                >
                                                                    <span className="text-slate-300">
                                                                        {item.quantity}x {item.productName}
                                                                    </span>
                                                                    <span className="text-white font-medium">
                                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Delivery Info */}
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                                            <MapPin size={16} className="text-primary" />
                                                            Delivery Information
                                                        </h4>
                                                        <div className="pl-6 space-y-2 text-sm text-slate-300">
                                                            <div>
                                                                <span className="text-slate-500">Address:</span>
                                                                <p className="mt-1">{order.address}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500">Phone:</span>
                                                                <p className="mt-1">{order.customerPhone}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                                                        <Link
                                                            href={`/track-order?id=${order.id}`}
                                                            className="flex-1 bg-primary text-slate-950 font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors text-center"
                                                        >
                                                            Track Order
                                                        </Link>
                                                        {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    initiateCancel(order.id);
                                                                }}
                                                                disabled={cancellingOrderId === order.id}
                                                                className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 font-bold py-3 px-4 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                                            >
                                                                {cancellingOrderId === order.id
                                                                    ? "Cancelling..."
                                                                    : "Cancel Order"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom Modal */}
                <AnimatePresence>
                    {showCancelModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCancelModal(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                            >
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                        <AlertTriangle size={32} className="text-red-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Cancel Order?</h3>
                                    <p className="text-slate-400 mb-6">
                                        Are you sure you want to cancel this order? This action cannot be undone and your payment will be refunded.
                                    </p>

                                    <div className="flex gap-3 w-full">
                                        <button
                                            onClick={() => setShowCancelModal(false)}
                                            className="flex-1 py-3 px-4 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                                        >
                                            Keep Order
                                        </button>
                                        <button
                                            onClick={confirmCancelOrder}
                                            className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-colors"
                                        >
                                            Yes, Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Toast Notification */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 50, x: "-50%" }}
                            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 ${toast.type === "success"
                                ? "bg-green-500 text-slate-900"
                                : "bg-red-500 text-white"
                                }`}
                        >
                            {toast.type === "success" ? (
                                <CheckCircle size={20} />
                            ) : (
                                <AlertTriangle size={20} />
                            )}
                            <span className="font-bold">{toast.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </>
    );
}

