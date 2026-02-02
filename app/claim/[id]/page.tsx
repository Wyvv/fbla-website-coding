"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FoundItem } from "@/lib/types";

export default function ClaimPage() {
    const params = useParams();
    const router = useRouter();
    const itemId = params.id as string;

    const [item, setItem] = useState<FoundItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        claimantName: "",
        claimantEmail: "",
        claimantPhone: "",
        description: "",
    });

    useEffect(() => {
        fetchItem();
    }, [itemId]);

    const fetchItem = async () => {
        try {
            const itemDoc = await getDoc(doc(db, "items", itemId));
            if (itemDoc.exists()) {
                setItem({ id: itemDoc.id, ...itemDoc.data() } as FoundItem);
            }
        } catch (err) {
            console.error("Error fetching item:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await addDoc(collection(db, "claims"), {
                itemId,
                ...formData,
                status: "pending",
                createdAt: serverTimestamp(),
            });

            setSuccess(true);} catch (err) {
            console.error("Error submitting claim:", err);
            setError("Failed to submit claim. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <span className="text-6xl">❌</span>
                <h1 className="text-2xl font-bold text-gray-800 mt-4">Item Not Found</h1>
                <p className="text-gray-600 mt-2">
                    This item may have been removed or claimed.
                </p>
                <button onClick={() => router.push("/items")} className="btn-primary mt-6">
                    Browse Items
                </button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Claim Request Submitted!
                </h1>
                <p className="text-gray-600 mb-8">
                    Our staff will review your claim and contact you at the email provided.
                    Please allow 1-2 business days for a response.
                </p>
                <button onClick={() => router.push("/items")} className="btn-primary">
                    Back to Items
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Claim This Item</h1>
            <p className="text-gray-600 mb-8">
                Please provide details to verify your ownership.
            </p>

            {/* Item Preview */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-2xl">📦</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                        <p className="text-sm text-primary">{item.category}</p>
                        <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>
                        <p className="text-sm text-gray-500">📅 Found: {item.dateFound}</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.claimantName}
                            onChange={(e) =>
                                setFormData({ ...formData, claimantName: e.target.value })
                            }
                            placeholder="Enter your full name"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.claimantEmail}
                            onChange={(e) =>
                                setFormData({ ...formData, claimantEmail: e.target.value })
                            }
                            placeholder="your.email@school.edu"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.claimantPhone}
                            onChange={(e) =>
                                setFormData({ ...formData, claimantPhone: e.target.value })
                            }
                            placeholder="(555) 123-4567"
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Proof of Ownership *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Please describe unique features of the item that prove it belongs to you (e.g., contents, scratches, stickers, personalization, etc.)"
                            className="input-field"
                        /><p className="text-sm text-gray-500 mt-2">
                        This helps us verify that you are the rightful owner.
                    </p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit Claim Request"}
                    </button>
                </div>
            </form>
        </div>
    );
}
