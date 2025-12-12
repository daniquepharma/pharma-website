
import { createProduct } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AddProductPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin"
                    className="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-4 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
                <h2 className="text-3xl font-heading font-bold text-white">Add New Product</h2>
                <p className="text-slate-400 mt-2">Fill in the details to add a new product to the inventory.</p>
            </div>

            <form action={createProduct} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="e.g. Paracetamol 500mg"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-slate-300">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                            <option value="Tablet/Capsule">Tablet/Capsule</option>
                            <option value="Syrup">Syrup</option>
                            <option value="Injection">Injection</option>
                            <option value="Gel/Ointment">Gel/Ointment</option>
                            <option value="Supplement">Supplement</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="stock" className="block text-sm font-medium text-slate-300">
                            Initial Stock
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            required
                            min="0"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="e.g. 100"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-medium text-slate-300">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="e.g. 19.99"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Brief description of the product..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="productImage" className="block text-sm font-medium text-slate-300">
                        Product Image
                    </label>
                    <input
                        type="file"
                        id="productImage"
                        name="productImage"
                        accept="image/*"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-slate-950 hover:file:bg-primary/90"
                    />
                    <p className="text-xs text-slate-500">
                        Upload a product image (JPG, PNG, WebP).
                    </p>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-primary text-slate-950 font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
}
