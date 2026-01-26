import { getProducts } from "@/app/actions";
import Link from "next/link";
import { Plus, Package, TrendingUp, AlertTriangle } from "lucide-react";
import ProductManagementCard from "@/components/ProductManagementCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const products = await getProducts();

    // Calculate statistics
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-white">Product Management</h2>
                    <p className="text-slate-400 mt-1">Manage your pharmaceutical inventory</p>
                </div>
                <Link
                    href="/admin/add"
                    className="bg-primary text-slate-950 px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add New Product
                </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Total Products</p>
                            <p className="text-2xl font-bold text-white">{totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Package className="text-primary" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Inventory Value</p>
                            <p className="text-2xl font-bold text-white">₹{totalValue.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="text-green-500" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Low Stock Items</p>
                            <p className="text-2xl font-bold text-yellow-400">{lowStockProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                            <AlertTriangle className="text-yellow-500" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm mb-1">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-400">{outOfStockProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                            <AlertTriangle className="text-red-500" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductManagementCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="text-slate-600" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Products Yet</h3>
                        <p className="text-slate-400 mb-6">Get started by adding your first product to the inventory.</p>
                        <Link
                            href="/admin/add"
                            className="inline-flex items-center gap-2 bg-primary text-slate-950 px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={18} />
                            Add Your First Product
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
