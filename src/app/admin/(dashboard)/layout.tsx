"use client";

import Link from "next/link";
import { LayoutDashboard, PlusCircle, ShoppingBag, Package, LogOut } from "lucide-react";
import { logout } from "@/app/actions";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-body">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 p-6 flex flex-col overflow-y-auto">
                <h1 className="text-2xl font-heading font-bold text-white mb-8 border-l-4 border-primary pl-4">
                    Admin Panel
                </h1>
                <nav className="flex-1 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/add"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                    >
                        <PlusCircle size={20} />
                        Add Product
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                    >
                        <Package size={20} />
                        Orders
                    </Link>
                </nav>
                <div className="pt-6 border-t border-slate-800 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                    >
                        <ShoppingBag size={20} />
                        View Live Site
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 hover:text-red-300"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
