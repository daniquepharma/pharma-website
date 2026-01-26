"use client";

import { deleteProduct } from "@/app/actions";
import { Product } from "@prisma/client";
import { Edit, Trash2, Package, DollarSign, Archive } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useRouter } from "next/navigation";

interface ProductManagementCardProps {
    product: Product;
}

export default function ProductManagementCard({ product }: ProductManagementCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteProduct(product.id);
            setShowDeleteModal(false);
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setDeleteError(error.message);
            } else {
                setDeleteError('Failed to delete product');
            }
            setIsDeleting(false);
        }
    };

    const isLowStock = product.stock < 10;
    const isOutOfStock = product.stock === 0;

    return (
        <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group">
                {/* Product Image */}
                <div className="relative h-48 bg-slate-800 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="text-slate-600" size={48} />
                        </div>
                    )}

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                        {isOutOfStock ? (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                Out of Stock
                            </span>
                        ) : isLowStock ? (
                            <span className="px-3 py-1 bg-yellow-500 text-slate-900 text-xs font-semibold rounded-full">
                                Low Stock
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                In Stock
                            </span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                    <div className="mb-3">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                            {product.name}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5rem]">
                            {product.description}
                        </p>
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                        <span className="inline-block px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded">
                            {product.category}
                        </span>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <DollarSign className="text-primary" size={18} />
                            <span className="text-xl font-bold text-white">
                                ₹{product.price.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Archive className="text-slate-400" size={16} />
                            <span className={`text-sm font-medium ${isOutOfStock ? "text-red-400" : isLowStock ? "text-yellow-400" : "text-green-400"}`}>
                                {product.stock} units
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-slate-950 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            <Edit size={16} />
                            Edit
                        </Link>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal
                productName={product.name}
                productId={product.id}
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setDeleteError(null);
                }}
                isOpen={showDeleteModal}
                error={deleteError}
                isDeleting={isDeleting}
            />
        </>
    );
}
