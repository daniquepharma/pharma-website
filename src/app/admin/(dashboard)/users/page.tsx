import { getAdminUsers, toggleUserVerification } from "@/app/actions";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: { search?: string };
}) {
    const search = searchParams.search || "";
    const users = await getAdminUsers(search);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">Customers / Verification</h2>

                {/* Search */}
                <form className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Search by name, email, business, or license..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                </form>
            </div>

            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-sm font-semibold text-slate-400">
                                <th className="p-4">Customer</th>
                                <th className="p-4">Business Details</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-sm text-slate-400">{user.email}</p>
                                            {user.phone && <p className="text-sm text-slate-400">{user.phone}</p>}
                                        </td>
                                        <td className="p-4">
                                            {user.businessName ? (
                                                <div className="space-y-1">
                                                    <p className="font-medium text-amber-500">{user.businessName}</p>
                                                    <p className="text-xs text-slate-400">DL/FSSAI: <span className="text-slate-300">{user.drugLicense}</span></p>
                                                    {user.gstNumber && <p className="text-xs text-slate-400">GST: <span className="text-slate-300">{user.gstNumber}</span></p>}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-500 italic">No business details provided</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-slate-300">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.isVerified ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    <CheckCircle size={14} /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <form action={async () => {
                                                "use server";
                                                await toggleUserVerification(user.id, !user.isVerified);
                                            }}>
                                                <button
                                                    type="submit"
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${user.isVerified
                                                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                                            : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white"
                                                        }`}
                                                >
                                                    {user.isVerified ? "Revoke" : "Approve B2B"}
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
