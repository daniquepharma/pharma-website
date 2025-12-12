
"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@prisma/client";
import { useState } from "react";
import { ShoppingCart, CheckCircle } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0]
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${added
                    ? "bg-green-600 text-white"
                    : "bg-primary text-slate-950 hover:bg-primary/90"
                } ${product.stock <= 0 ? "opacity-50 cursor-not-allowed bg-slate-700 text-slate-400" : ""}`}
        >
            {added ? (
                <>
                    <CheckCircle size={24} />
                    Added to Cart
                </>
            ) : (
                <>
                    <ShoppingCart size={24} />
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </>
            )}
        </button>
    );
}
