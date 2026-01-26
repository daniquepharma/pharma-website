import { getAllOrders } from "@/app/actions";
import OrderTable from "@/components/OrderTable";
import { Package } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await getAllOrders();

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
                    <Package className="text-primary" />
                    Order Management
                </h2>
                <p className="text-slate-400 mt-2">Manage customer orders and update shipping status.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <OrderTable orders={orders} />
            </div>
        </div>
    );
}
