import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ShippingPolicy() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
                <h1 className="text-4xl font-heading font-bold text-white mb-8">Shipping & Delivery Policy</h1>
                <div className="space-y-6 text-slate-400 leading-relaxed bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
                    <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="space-y-4 pt-4">
                        <h2 className="text-2xl font-bold text-white">1. Order Processing Time</h2>
                        <p>
                            All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">2. Domestic Shipping Rates and Estimates</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Standard Shipping:</strong> Estimated delivery within 3-7 business days depending on your location.</li>
                            <li><strong>Shipping Charges:</strong> Shipping charges for your order will be calculated and displayed at checkout. We may offer free shipping for orders exceeding a certain amount, which will be specified on our website.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">3. International Shipping</h2>
                        <p>
                            Currently, we only ship within India. We do not offer international shipping at this time.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">4. Order Tracking</h2>
                        <p>
                            When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
                        </p>
                        <p>
                            You can also log into your account and check your order history to view the tracking details.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">5. P.O. Boxes and APO/FPO Addresses</h2>
                        <p>
                            We cannot ship to P.O. boxes or APO/FPO addresses. Please provide a valid physical street address for delivery.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
                        <p>
                            If you have any questions about the delivery and shipment of your order, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
