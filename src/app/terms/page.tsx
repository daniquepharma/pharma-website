
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
    return (
        <main className="bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
                <h1 className="text-4xl font-heading font-bold text-white mb-8">Terms of Service</h1>
                <div className="space-y-6 text-slate-400 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
                        <p>
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Danique Formulations ("we," "us" or "our"),
                            concerning your access to and use of our website. By accessing the site, you have read, understood, and agreed to be bound by all of these Terms of Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">2. Medical Disclaimer</h2>
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                            <p className="text-red-200">
                                <strong>IMPORTANT:</strong> The information provided on this website is for informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment.
                                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">3. Products and Services</h2>
                        <p>
                            All products and services listed on the website are subject to availability. We reserve the right to discontinue any product at any time.
                            We attempt to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">4. User Registration</h2>
                        <p>
                            You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password.
                            We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">5. Limitation of Liability</h2>
                        <p>
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages,
                            including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">6. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and defined following the laws of India. Danique Formulations and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">7. Contact Us</h2>
                        <p>
                            To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:daniqueformulations@gmail.com" className="text-primary hover:underline">daniqueformulations@gmail.com</a>.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
