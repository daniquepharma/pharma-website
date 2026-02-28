"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useRazorpay } from "@/hooks/useRazorpay";
import Link from "next/link";
import { Trash2, ArrowLeft, CheckCircle, Plus, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Address {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

export default function CheckoutPage() {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();
    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);

    // Form state for new address
    const [newAddress, setNewAddress] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/auth/login?callbackUrl=/checkout");
        }
    }, [status]);

    // Fetch saved addresses
    useEffect(() => {
        if (session?.user) {
            fetchAddresses();
        }
    }, [session]);

    async function fetchAddresses() {
        try {
            const response = await fetch("/api/user/addresses");
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);

                // Auto-select default address or first address
                const defaultAddr = data.find((a: Address) => a.isDefault);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.id);
                } else if (data.length > 0) {
                    setSelectedAddressId(data[0].id);
                } else {
                    setShowNewAddressForm(true);
                }
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setLoadingAddresses(false);
        }
    }

    async function handleSaveNewAddress() {
        // Validate required fields
        if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAddress),
            });

            if (response.ok) {
                const savedAddress = await response.json();
                setAddresses([...addresses, savedAddress]);
                setSelectedAddressId(savedAddress.id);
                setShowNewAddressForm(false);
                // Reset form
                setNewAddress({
                    fullName: "",
                    phone: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    pincode: "",
                });
            } else {
                const data = await response.json();
                alert(data.error || "Failed to save address");
            }
        } catch (error) {
            console.error("Failed to save address:", error);
            alert("Failed to save address. Please try again.");
        }
    }

    const isRazorpayLoaded = useRazorpay();

    async function handlePaymentSuccess(response: any, orderData: any) {
        try {
            const result = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    address: orderData.address,
                    phone: orderData.phone,
                    total: cartTotal,
                    items: cart.map(item => ({
                        productId: item.id,
                        productName: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    paymentDetails: {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    }
                }),
            });

            if (result.ok) {
                const data = await result.json();
                setOrderId(data.orderId);
                clearCart();
            } else {
                alert("Payment verification failed");
            }
        } catch (error) {
            console.error("Payment success handling error", error);
            alert("Something went wrong processing your payment");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!selectedAddressId) {
            alert("Please select a delivery address");
            return;
        }

        if (!isRazorpayLoaded) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

        setIsSubmitting(true);

        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress) return;

        const fullAddress = `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;

        try {
            // 1. Create Razorpay Order
            const orderRes = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: cartTotal,
                    currency: "INR",
                }),
            });

            if (!orderRes.ok) {
                alert("Failed to create order");
                setIsSubmitting(false);
                return;
            }

            const order = await orderRes.json();

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // We need to expose this
                amount: order.amount,
                currency: order.currency,
                name: "Danique Pharma",
                description: "Purchase from Danique Pharma",
                order_id: order.id,
                handler: function (response: any) {
                    handlePaymentSuccess(response, {
                        address: fullAddress,
                        phone: selectedAddress.phone,
                    });
                },
                prefill: {
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                    contact: selectedAddress.phone,
                },
                theme: {
                    color: "#0f172a", // slate-900
                },
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

            rzp1.on('payment.failed', function (response: any) {
                alert(response.error.description);
                setIsSubmitting(false);
            });

        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    }

    // Loading state
    if (status === "loading" || loadingAddresses) {
        return (
            <main className="bg-slate-950 min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </main>
        );
    }

    if (!session) {
        return (
            <main className="bg-slate-950 min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </main>
        );
    }

    if (orderId) {
        return (
            <main className="bg-slate-950 min-h-screen">
                <Suspense fallback={<div className="h-20 bg-slate-950" />}>
                    <Navbar />
                </Suspense>
                <div className="pt-32 pb-20 px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12">
                            <CheckCircle className="mx-auto mb-6 text-green-500" size={80} />
                            <h1 className="text-3xl font-bold text-white mb-4">Order Placed Successfully!</h1>
                            <p className="text-slate-400 mb-8">
                                Your order has been confirmed. Order ID:{" "}
                                <span className="text-primary font-mono">{orderId.slice(0, 8)}</span>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/products"
                                    className="bg-slate-800 text-white font-bold px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="bg-slate-950 min-h-screen">
                <Suspense fallback={<div className="h-20 bg-slate-950" />}>
                    <Navbar />
                </Suspense>
                <div className="pt-32 pb-20 px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12">
                            <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
                            <p className="text-slate-400 mb-8">Add some products to your cart to checkout.</p>
                            <Link
                                href="/products"
                                className="inline-block bg-primary text-slate-950 font-bold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="bg-slate-950 min-h-screen">
            <Suspense fallback={<div className="h-20 bg-slate-950" />}>
                <Navbar />
            </Suspense>
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
                    >
                        <ArrowLeft size={20} />
                        Continue Shopping
                    </Link>

                    <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

                    <div className="grid lg:grid-cols-3 gap-8 flex-col-reverse lg:flex-row">
                        {/* Address Selection / Form */}
                        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
                            {/* Saved Addresses */}
                            {!showNewAddressForm && addresses.length > 0 && (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-white">Select Delivery Address</h2>
                                        <button
                                            onClick={() => setShowNewAddressForm(true)}
                                            className="flex items-center gap-2 text-primary hover:underline text-sm"
                                        >
                                            <Plus size={16} />
                                            Add New Address
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                onClick={() => setSelectedAddressId(address.id)}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddressId === address.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-slate-700 hover:border-slate-600"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        checked={selectedAddressId === address.id}
                                                        onChange={() => setSelectedAddressId(address.id)}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-white">{address.fullName}</span>
                                                            {address.isDefault && (
                                                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-300 text-sm">{address.phone}</p>
                                                        <p className="text-slate-400 text-sm mt-2">
                                                            {address.addressLine1}
                                                            {address.addressLine2 && `, ${address.addressLine2}`}
                                                            <br />
                                                            {address.city}, {address.state} - {address.pincode}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Address Form */}
                            {showNewAddressForm && (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-white">Add New Delivery Address</h2>
                                        {addresses.length > 0 && (
                                            <button
                                                onClick={() => setShowNewAddressForm(false)}
                                                className="text-slate-400 hover:text-white text-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.fullName}
                                                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                                    required
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={newAddress.phone}
                                                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                    required
                                                    placeholder="1234567890"
                                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Address Line 1 (House No, Building, Street) *
                                            </label>
                                            <input
                                                type="text"
                                                value={newAddress.addressLine1}
                                                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                                                required
                                                placeholder="123 Main Street"
                                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Address Line 2 (Area, Landmark) (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={newAddress.addressLine2}
                                                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                                                placeholder="Near Central Park"
                                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    required
                                                    placeholder="Mumbai"
                                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    required
                                                    placeholder="Maharashtra"
                                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    Pincode *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.pincode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                    required
                                                    placeholder="400001"
                                                    maxLength={6}
                                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSaveNewAddress}
                                            type="button"
                                            className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-700 transition-colors"
                                        >
                                            Save Address & Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Place Order Button */}
                            <form onSubmit={handleSubmit}>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedAddressId}
                                    className="w-full bg-primary text-slate-950 font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Processing..." : `Pay ₹${cartTotal.toFixed(2)} & Place Order`}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 order-1 lg:order-2 mb-8 lg:mb-0">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{item.name}</p>
                                                <p className="text-slate-400 text-sm">
                                                    ₹{item.price.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className="text-white font-bold">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-slate-800 pt-4">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span className="text-white">Total</span>
                                        <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
