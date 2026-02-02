"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FoundItem, ClaimRequest } from "@/lib/types";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<"items" | "claims">("items");
    const [items, setItems] = useState<FoundItem[]>([]);
    const [claims, setClaims] = useState<(ClaimRequest & { itemTitle?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const fetchData = async () => {
        try {
            setLoading(true);

            const itemsQuery = query(collection(db, "items"), orderBy("createdAt", "desc"));
            const itemsSnapshot = await getDocs(itemsQuery);
            const itemsData = itemsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as FoundItem[];
            setItems(itemsData);

            const claimsQuery = query(collection(db, "claims"), orderBy("createdAt", "desc"));
            const claimsSnapshot = await getDocs(claimsQuery);
            const claimsData = claimsSnapshot.docs.map((doc) => {
                const claim = { id: doc.id, ...doc.data() } as ClaimRequest;
                const item = itemsData.find((i) => i.id === claim.itemId);
                return { ...claim, itemTitle: item?.title };
            });
            setClaims(claimsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateItemStatus = async (itemId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "items", itemId), { status: newStatus });
            await fetchData();
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const updateClaimStatus = async (claimId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "claims", claimId), { status: newStatus });
            await fetchData();
        } catch (error) {
            console.error("Error updating claim:", error);
        }
    };

    const deleteItem = async (itemId: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteDoc(doc(db, "items", itemId));
                await fetchData();
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "1234") {
            setIsAuthenticated(true);
            fetchData();
        } else {
            alert("Incorrect password");
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                        Admin Login
                    </h1>
                    <p className="text-gray-600 mb-8 text-center">
                        Enter password to access dashboard
                    </p>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const stats = {
        totalItems: items.length,
        pendingItems: items.filter(item => item.status === "pending").length,
        approvedItems: items.filter(item => item.status === "approved").length,
        claimedItems: items.filter(item => item.status === "claimed").length,
        totalClaims: claims.length,
        pendingClaims: claims.filter(claim => claim.status === "pending").length,
        approvedClaims: claims.filter(claim => claim.status === "approved").length,
    };

    const filteredItems = filterStatus === "all"
        ? items
        : items.filter(item => item.status === filterStatus);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="btn-secondary"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Items</p>
                    <p className="text-4xl font-bold mb-2">{stats.totalItems}</p>
                    <p className="text-blue-100 text-sm">📦 All found items</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-yellow-100 text-sm font-medium mb-1">Pending Review</p>
                    <p className="text-4xl font-bold mb-2">{stats.pendingItems}</p>
                    <p className="text-yellow-100 text-sm">⏳ Awaiting approval</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-green-100 text-sm font-medium mb-1">Active Listings</p>
                    <p className="text-4xl font-bold mb-2">{stats.approvedItems}</p>
                    <p className="text-green-100 text-sm">✅ Available for claims</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-purple-100 text-sm font-medium mb-1">Total Claims</p>
                    <p className="text-4xl font-bold mb-2">{stats.totalClaims}</p>
                    <p className="text-purple-100 text-sm">📝 Claim requests</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab("items")}
                        className={`px-6 py-3 font-medium ${
                            activeTab === "items"
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Found Items ({items.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("claims")}
                        className={`px-6 py-3 font-medium ${
                            activeTab === "claims"
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Claims ({claims.length})
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                ) : activeTab === "items" ? (
                    <div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="input-field max-w-xs"
                            >
                                <option value="all">All Items</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="claimed">Claimed</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                Category: {item.category} | Location: {item.location}
                                            </p>
                                            <p className="text-sm text-gray-500">Found: {item.dateFound}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                item.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : item.status === "claimed"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                      {item.status}
                    </span>
                                    </div><p className="text-gray-600 mb-4">{item.description}</p>
                                    {item.imageUrl && (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-32 h-32 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    <div className="flex gap-2">
                                        {item.status === "pending" && (
                                            <button
                                                onClick={() => updateItemStatus(item.id, "approved")}
                                                className="btn-primary"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {item.status === "approved" && (
                                            <button
                                                onClick={() => updateItemStatus(item.id, "claimed")}
                                                className="btn-secondary"
                                            >
                                                Mark as Claimed
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {claims.map((claim) => (
                            <div
                                key={claim.id}
                                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Claim for: {claim.itemTitle || "Unknown Item"}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Claimant: {claim.claimantName} ({claim.claimantEmail})
                                        </p>
                                        <p className="text-sm text-gray-500">Phone: {claim.claimantPhone}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            claim.status === "approved"
                                                ? "bg-green-100 text-green-800"
                                                : claim.status === "rejected"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                    {claim.status}
                  </span>
                                </div>
                                <p className="text-gray-600 mb-4">{claim.description}</p>
                                {claim.status === "pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateClaimStatus(claim.id, "approved")}
                                            className="btn-primary"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateClaimStatus(claim.id, "rejected")}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
