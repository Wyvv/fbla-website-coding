"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { FoundItem, ClaimRequest } from "@/lib/types";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"items" | "claims">("items");
    const [items, setItems] = useState<FoundItem[]>([]);
    const [claims, setClaims] = useState<(ClaimRequest & { itemTitle?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch items
            const itemsQuery = query(
                collection(db, "items"),
                orderBy("createdAt", "desc")
            );
            const itemsSnapshot = await getDocs(itemsQuery);
            const fetchedItems = itemsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as FoundItem[];
            setItems(fetchedItems);

            // Fetch claims
            const claimsQuery = query(
                collection(db, "claims"),
                orderBy("createdAt", "desc")
            );
            const claimsSnapshot = await getDocs(claimsQuery);
            const fetchedClaims = claimsSnapshot.docs.map((doc) => {
                const claimData = doc.data();
                const relatedItem = fetchedItems.find((i) => i.id === claimData.itemId);
                return {
                    id: doc.id,
                    ...claimData,
                    itemTitle: relatedItem?.title || "Unknown Item",
                };
            }) as (ClaimRequest & { itemTitle?: string })[];
            setClaims(fetchedClaims);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateItemStatus = async (
        itemId: string,
        status: FoundItem["status"]
    ) => {
        try {
            await updateDoc(doc(db, "items", itemId), { status });
            setItems(items.map((i) => (i.id === itemId ? { ...i, status } : i)));
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    const deleteItem = async (itemId: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteDoc(doc(db, "items", itemId));
            setItems(items.filter((i) => i.id !== itemId));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const updateClaimStatus = async (
        claimId: string,
        status: ClaimRequest["status"]
    ) => {
        try {
            await updateDoc(doc(db, "claims", claimId), { status });
            setClaims(claims.map((c) => (c.id === claimId ? { ...c, status } : c)));
        } catch (error) {
            console.error("Error updating claim:", error);
        }
    };

    const filteredItems =
        filterStatus === "all"
            ? items
            : items.filter((i) => i.status === filterStatus);

    const filteredClaims =
        filterStatus === "all"
            ? claims
            : claims.filter((c) => c.status === filterStatus);

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        claimed: "bg-blue-100 text-blue-800",
        rejected: "bg-red-100 text-red-800",
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">Manage found items and claim requests</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="text-2xl font-bold text-primary">
                        {items.filter((i) => i.status === "pending").length}
                    </div>
                    <div className="text-gray-600 text-sm">Pending Items</div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="text-2xl font-bold text-green-600">
                        {items.filter((i) => i.status === "approved").length}
                    </div>
                    <div className="text-gray-600 text-sm">Approved Items</div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="text-2xl font-bold text-blue-600">
                        {claims.filter((c) => c.status === "pending").length}
                    </div>
                    <div className="text-gray-600 text-sm">Pending Claims</div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="text-2xl font-bold text-purple-600">{items.length}</div>
                    <div className="text-gray-600 text-sm">Total Items</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("items")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        activeTab === "items"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Found Items ({items.length})
                </button>
                <button
                    onClick={() => setActiveTab("claims")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        activeTab === "claims"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Claim Requests ({claims.length})
                </button>
            </div>

            {/* Filter */}
            <div className="mb-6">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field max-w-xs"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="claimed">Claimed</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            ) : activeTab === "items" ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Item
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date Found
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        📦
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {item.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    by {item.finderName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.category}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.location}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.dateFound}
                                    </td>
                                    <td className="px-6 py-4">
                      <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}
                      >
                        {item.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {item.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => updateItemStatus(item.id, "approved")}
                                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateItemStatus(item.id, "rejected")}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {item.status === "approved" && (
                                                <button
                                                    onClick={() => updateItemStatus(item.id, "claimed")}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Mark Claimed
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredItems.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No items found
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Claimant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Item
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Proof
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {filteredClaims.map((claim) => (
                                <tr key={claim.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {claim.claimantName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {claim.itemTitle}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">
                                            {claim.claimantEmail}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {claim.claimantPhone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                        {claim.description}
                                    </td>
                                    <td className="px-6 py-4">
                      <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[claim.status]}`}
                      >
                        {claim.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {claim.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            updateClaimStatus(claim.id, "approved")
                                                        }
                                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            updateClaimStatus(claim.id, "rejected")
                                                        }
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredClaims.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No claims found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
