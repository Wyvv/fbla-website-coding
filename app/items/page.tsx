"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { FoundItem, Category } from "@/lib/types";
import ItemCard from "@/components/ItemCard";

const categories: Category[] = [
    "Electronics",
    "Clothing",
    "Books",
    "Accessories",
    "Sports Equipment",
    "Other",
];

export default function ItemsPage() {
    const [items, setItems] = useState<FoundItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const itemsRef = collection(db, "items");
            const q = query(
                itemsRef,
                where("status", "==", "approved"),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            const fetchedItems: FoundItem[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as FoundItem[];
            setItems(fetchedItems);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Browse Found Items
            </h1>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search Items
                        </label>
                        <input
                            type="text"
                            placeholder="Search by title, description, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input-field"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading items...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <span className="text-6xl">📭</span>
                    <h2 className="text-xl font-semibold text-gray-800 mt-4">
                        No items found
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 mb-4">
                        Showing {filteredItems.length} item
                        {filteredItems.length !== 1 ? "s" : ""}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
