"use client";

import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/actions";
import { Order, OrderItem, Product } from "@prisma/client";
import { ChevronDown, ChevronRight, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, Edit2, Save, Search, List } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OrderWithItems = Order & {
    items: (OrderItem & {
        product: Product | null;
    })[];
};

export default function OrderTable({ orders }: { orders: OrderWithItems[] }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleOrderUpdate = () => {
        setRefreshKey(prev => prev + 1);
        router.refresh();
    };

    // Filter orders based on active tab and search term
    const filteredOrders = orders.filter(o => {
        const matchesTab = activeTab === "ALL" || o.status === activeTab;
        const matchesSearch = searchTerm === "" ||
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.customerPhone && o.customerPhone.includes(searchTerm)) ||
            (o.address && o.address.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesTab && matchesSearch;
    });

    const tabs = [
        { id: "ALL", label: "All Orders", icon: List, color: "text-slate-400" },
        { id: "PENDING", label: "Pending", icon: Clock, color: "text-yellow-500" },
        { id: "CONFIRMED", label: "Confirmed", icon: CheckCircle, color: "text-blue-500" },
        { id: "SHIPPED", label: "Shipped", icon: Truck, color: "text-purple-500" },
        { id: "DELIVERED", label: "Delivered", icon: Package, color: "text-green-500" },
        { id: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Search and Tabs */}
            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search orders by ID, name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-1">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const count = orders.filter(o => tab.id === "ALL" ? true : o.status === tab.id).length;

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
            </div>

            {/* Content */}
            <div className="bg-slate-900 border border-slate-800 rounded-b-xl rounded-tr-xl min-h-[400px]">
                <div className="overflow-visible">
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
                                <OrderRow key={`${order.id}-${refreshKey}`} order={order} onUpdate={handleOrderUpdate} />
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

function OrderRow({ order, onUpdate }: { order: OrderWithItems; onUpdate: () => void }) {
    const [updating, setUpdating] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        customerName: order.customerName,
        customerPhone: order.customerPhone || "",
        address: order.address,
    });
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
        onUpdate();
    };

    const handleEditSave = async () => {
        setUpdating(true);
        try {
            const response = await fetch(`/api/admin/orders/${order.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (response.ok) {
                setIsEditing(false);
                onUpdate();
            } else {
                alert("Failed to update order");
            }
        } catch (error) {
            console.error("Failed to update order:", error);
            alert("Failed to update order");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
            <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors group"
                        title="View Full ID & Details"
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span className="font-mono text-xs text-white group-hover:underline decoration-dashed underline-offset-4" title={order.id}>
                            #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                    </button>
                </td>
                <td className="p-4">
                    <div className="font-medium text-white">{order.customerName}</div>
                </td>
                <td className="p-4 text-slate-300 text-sm">
                    <div className="flex flex-col gap-1">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-2 text-xs">
                                <span className="text-slate-500">{item.quantity}x</span>
                                <span>{item.productName}</span>
                            </div>
                        ))}
                    </div>
                </td>
                <td className="p-4 font-medium text-white">
                    ₹{order.total.toFixed(2)}
                </td>
                <td className="p-4 relative">
                    <div ref={dropdownRef} className="relative inline-block text-left">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            disabled={updating}
                            className={`inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isOpen ? "bg-primary text-slate-900" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                                } disabled:opacity-50 min-w-[110px]`}
                        >
                            {updating ? "Updating..." : (
                                <span className="flex items-center gap-2">
                                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                                </span>
                            )}
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
            {/* Expanded Details Row */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-slate-800/50"
                    >
                        <td colSpan={5} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-primary" />
                                            <span className="font-medium text-white">Delivery Information</span>
                                        </div>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                                            >
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleEditSave}
                                                    disabled={updating}
                                                    className="text-xs flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                                                >
                                                    <Save size={12} /> Save
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pl-6 text-slate-300 space-y-3">
                                        {isEditing ? (
                                            <>
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Customer Name</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.customerName}
                                                        onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Address</label>
                                                    <textarea
                                                        value={editForm.address}
                                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary min-h-[60px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.customerPhone}
                                                        onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <span className="text-slate-500 text-xs">Customer:</span>
                                                    <p className="mt-1">{order.customerName}</p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 text-xs">Address:</span>
                                                    <p className="mt-1">{order.address}</p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 text-xs">Email:</span>
                                                    <p className="mt-1">{order.customerEmail}</p>
                                                </div>
                                                {order.customerPhone && (
                                                    <div>
                                                        <span className="text-slate-500 text-xs">Phone:</span>
                                                        <p className="mt-1">{order.customerPhone}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle size={16} className="text-primary" />
                                        <span className="font-medium text-white">Order Details</span>
                                    </div>
                                    <div className="pl-6 text-slate-300 space-y-1">
                                        <p className="mb-2">
                                            <span className="text-slate-500 text-xs block">Order ID:</span>
                                            <span className="font-mono text-white select-all">{order.id}</span>
                                        </p>
                                        <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p>Status: <span className="font-medium text-white">{order.status}</span></p>
                                        <p>Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </>
    );
}
