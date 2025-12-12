
import Link from "next/link";
import { LayoutDashboard, PlusCircle, ShoppingBag, Package } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200 font-body">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
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
                <div className="pt-6 border-t border-slate-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                    >
                        <ShoppingBag size={20} />
                        View Live Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
