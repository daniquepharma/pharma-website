import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RefundPolicy() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
                <h1 className="text-4xl font-heading font-bold text-white mb-8">Cancellation & Refund Policy</h1>
                <div className="space-y-6 text-slate-400 leading-relaxed bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                    <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="space-y-4 pt-4">
                        <h2 className="text-2xl font-bold text-white">1. Order Cancellations</h2>
                        <p>
                            You may request a cancellation of your order prior to its dispatch.
                            If your order has not been shipped yet, we will cancel the order and process a full refund.
                        </p>
                        <p>
                            Once an order has been shipped, it cannot be cancelled.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">2. Returns</h2>
                        <p>
                            Due to the sensitive nature of our pharmaceutical products, we generally do not accept returns. However, replacement or return requests will be considered under the following circumstances:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>The wrong item was delivered to you.</li>
                            <li>The product was damaged or defective upon delivery.</li>
                            <li>The product was expired upon delivery.</li>
                        </ul>
                        <p>
                            Please notify us within 48 hours of receiving the delivery if any of the above situations apply. You will need to provide photographic evidence of the issue.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">3. Refund Process</h2>
                        <p>
                            If your return/cancellation is approved, a refund will be initiated to your original method of payment.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Online Payments (UPI, Cards, Net Banking):</strong> Refunds will be processed within 5 to 7 business days from the date of approval.</li>
                            <li><strong>Cash on Delivery (COD):</strong> Currently, we may not offer COD. If we do, refunds for COD orders will require you to provide bank account details.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">4. Exceptions</h2>
                        <p>
                            Certain items cannot be returned or refunded unless they are defective. This includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Products that have been opened or used.</li>
                            <li>Products missing their original packaging or labels.</li>
                            <li>Products damaged due to misuse or improper storage after delivery.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">5. Contact Us</h2>
                        <p>
                            To request a cancellation, return, or refund, please <Link href="/contact" className="text-primary hover:underline">contact us</Link> immediately with your order details.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
