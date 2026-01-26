import { getProductById, updateProduct, deleteProductImage } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        redirect('/admin');
    }

    async function handleUpdate(formData: FormData) {
        'use server'
        await updateProduct(id, formData);
        redirect('/admin');
    }

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
                <h2 className="text-3xl font-heading font-bold text-white">Edit Product</h2>
                <p className="text-slate-400 mt-2">Update product information and inventory.</p>
            </div>

            <form action={handleUpdate} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
                {/* Current Images Management */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-300">
                        Product Images
                    </label>

                    {product.images && product.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {product.images.map((img, index) => (
                                <div key={index} className="relative group aspect-square bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
                                    <Image
                                        src={img}
                                        alt={`${product.name} ${index + 1}`}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                    {/* Delete Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            formAction={deleteProductImage.bind(null, product.id, img)}
                                            className="bg-red-600/90 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">No images uploaded.</p>
                    )}

                    <div className="space-y-2 pt-4">
                        <label htmlFor="productImage" className="block text-sm font-medium text-slate-300">
                            Add New Images
                        </label>
                        <input
                            type="file"
                            id="productImage"
                            name="productImage"
                            accept="image/*"
                            multiple
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-slate-950 hover:file:bg-primary/90"
                        />
                        <p className="text-xs text-slate-500">
                            Select multiple files to add to the existing collection.
                        </p>
                    </div>
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
                        className="flex-1 bg-primary text-slate-950 font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    );
}
