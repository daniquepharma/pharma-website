
import { getProducts, deleteProduct } from "../actions";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const products = await getProducts();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-white">Products</h2>
                <Link
                    href="/admin/add"
                    className="bg-primary text-slate-950 px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add New
                </Link>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Price</th>
                            <th className="px-6 py-4 font-medium">Stock</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{product.name}</div>
                                    <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                        {product.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-300 font-mono">
                                    ${product.price ? product.price.toFixed(2) : "0.00"}
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    {product.stock > 0 ? (
                                        <span className="text-green-400">{product.stock} In Stock</span>
                                    ) : (
                                        <span className="text-red-400">Out of Stock</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <form action={async () => {
                                        "use server";
                                        await deleteProduct(product.id);
                                    }}>
                                        <button className="text-slate-400 hover:text-red-400 transition-colors p-2">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No products found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
