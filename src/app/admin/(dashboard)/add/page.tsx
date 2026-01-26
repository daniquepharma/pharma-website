"use client";

import { createProduct } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddProductPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [productName, setProductName] = useState("");
    const [resetKey, setResetKey] = useState(0); // Key to force re-render/reset of RichTextEditor
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const nameValue = formData.get("name") as string;
        setProductName(nameValue);

        try {
            await createProduct(formData);

            // Show success message
            setShowSuccess(true);

            // Reset form
            formRef.current?.reset();
            setResetKey(prev => prev + 1); // Force RichTextEditor reset

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Failed to add product", error);
            alert("Failed to add product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Success Notification */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
                    >
                        <CheckCircle size={24} />
                        <div>
                            <p className="font-bold">Product Added Successfully!</p>
                            <p className="text-sm opacity-90">{productName} has been added to inventory</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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

            <form ref={formRef} action={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
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
                            <option value="Tablets">Tablets</option>
                            <option value="Capsules">Capsules</option>
                            <option value="Injections">Injections</option>
                            <option value="Syrups">Syrups</option>
                            <option value="Gels">Gels</option>
                            <option value="Others">Others</option>
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
                        Price (₹)
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
                    <RichTextEditor
                        key={resetKey}
                        name="description"
                        placeholder="Add rich formatted description... Use **bold**, *italic*, # headings, and - lists"
                    />
                </div>

                <div className="space-y-4">
                    <label htmlFor="productImage" className="block text-sm font-medium text-slate-300">
                        Product Images
                    </label>
                    <input
                        type="file"
                        id="productImage"
                        name="productImage"
                        accept="image/*"
                        multiple
                        required
                        onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            // Simple client-side preview could be added here if needed, 
                            // but standard file input shows count.
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-slate-950 hover:file:bg-primary/90"
                    />
                    <p className="text-xs text-slate-500">
                        You can select multiple images.
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <Link
                        href="/admin"
                        className="flex-1 text-center bg-slate-800 text-slate-300 font-medium py-3 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary text-slate-950 font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Add Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
