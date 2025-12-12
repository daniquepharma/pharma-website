"use client";

import { updateOrderStatus } from "@/app/actions";
import { Order, OrderItem, Product } from "@prisma/client";
import { ChevronDown, ChevronRight, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OrderWithItems = Order & {
    items: (OrderItem & {
        product: Product;
    })[];
};

export default function OrderTable({ orders }: { orders: OrderWithItems[] }) {
    const [activeTab, setActiveTab] = useState("PENDING");

    // Filter orders based on active tab
    const filteredOrders = orders.filter(o => o.status === activeTab);

    const tabs = [
        { id: "PENDING", label: "Pending", icon: Clock, color: "text-yellow-500" },
        { id: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "text-blue-500" },
        { id: "SHIPPED", label: "Shipped", icon: Truck, color: "text-purple-500" },
        { id: "DELIVERED", label: "Delivered", icon: Package, color: "text-green-500" },
        { id: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-1">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const count = orders.filter(o => o.status === tab.id).length;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all relative ${isActive
                                    ? "bg-slate-900 text-white border-t border-x border-slate-800 -mb-px font-medium"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                                }`}
                        >
                            <tab.icon size={16} className={tab.color} />
                            {tab.label}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-slate-800 text-white" : "bg-slate-800/50 text-slate-500"}`}>
                                {count}
                            </span>
                            {isActive && <div className="absolute bottom-[-1px] left-0 w-full h-px bg-slate-900" />}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="bg-slate-900 border border-slate-800 rounded-b-xl rounded-tr-xl overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/50 border-b border-slate-800">
                            <tr>
                                <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Order ID</th>
                                <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Customer</th>
                                <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Items</th>
                                <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Total</th>
                                <th className="p-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredOrders.map((order) => (
                                <OrderRow key={order.id} order={order} />
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                                                <Package className="text-slate-600" size={32} />
                                            </div>
                                            <p>No {activeTab.toLowerCase()} orders found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function OrderRow({ order }: { order: OrderWithItems }) {
    const [updating, setUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true);
        setIsOpen(false);
        await updateOrderStatus(order.id, newStatus);
        setUpdating(false);
    };

    return (
        <tr className="hover:bg-slate-800/30 transition-colors">
            <td className="p-4 font-mono text-sm text-slate-500">
                {order.id.slice(0, 8)}...
            </td>
            <td className="p-4">
                <div className="font-medium text-white">{order.customerName}</div>
                <div className="text-xs text-slate-500">{order.customerEmail}</div>
            </td>
            <td className="p-4 text-slate-300 text-sm">
                <div className="flex flex-col gap-1">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex gap-2 text-xs">
                            <span className="text-slate-500">{item.quantity}x</span>
                            <span>{item.product.name}</span>
                        </div>
                    ))}
                </div>
            </td>
            <td className="p-4 font-medium text-white">
                ${order.total.toFixed(2)}
            </td>
            <td className="p-4 relative">
                <div ref={dropdownRef} className="relative inline-block text-left">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        disabled={updating}
                        className={`inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isOpen ? "bg-primary text-slate-900" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                            } disabled:opacity-50`}
                    >
                        {updating ? "Updating..." : "Actions"}
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-xl overflow-hidden z-50 ring-1 ring-black ring-opacity-5"
                            >
                                <div className="p-1">
                                    {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => {
                                        if (status === order.status) return null; // Don't show current status

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdate(status)}
                                                className="flex w-full items-center px-3 py-2 text-sm text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                                            >
                                                <span className={`w-2 h-2 rounded-full mr-2 ${status === "PENDING" ? "bg-yellow-500" :
                                                    status === "CONFIRMED" ? "bg-blue-500" :
                                                        status === "SHIPPED" ? "bg-purple-500" :
                                                            status === "DELIVERED" ? "bg-green-500" : "bg-red-500"
                                                    }`}></span>
                                                Move to {status.charAt(0) + status.slice(1).toLowerCase()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </td>
        </tr>
    );
}
