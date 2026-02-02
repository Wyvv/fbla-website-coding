"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Category } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const categories: Category[] = [
    "Electronics",
    "Clothing",
    "Books",
    "Accessories",
    "Sports Equipment",
    "Other",
];

export default function ReportPage() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        dateFound: "",
        finderName: "",
        finderEmail: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let imageUrl = null;

            if (image) {
                const imageRef = ref(storage, `items/${uuidv4()}-${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            await addDoc(collection(db, "items"), {
                ...formData,
                imageUrl,
                status: "pending",
                createdAt: serverTimestamp(),
            });

            setSuccess(true);
            setFormData({
                title: "",
                description: "",
                category: "",
                location: "",
                dateFound: "",
                finderName: "",
                finderEmail: "",
            });
            setImage(null);
            setImagePreview(null);
        } catch (err) {
            console.error("Error submitting form:", err);
            setError("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Thank You for Reporting!
                </h1>
                <p className="text-gray-600 mb-8">
                    Your found item has been submitted and is pending review. Our staff
                    will approve it shortly and it will appear in the listings.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="btn-primary"
                >
                    Report Another Item
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Report a Found Item
            </h1>
            <p className="text-gray-600 mb-8">
                Found something on campus? Fill out this form to help the owner find it.
            </p>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-6">
                    {/* Item Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Item Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            placeholder="e.g., Blue Backpack, iPhone 15, Math Textbook"
                            className="input-field"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            className="input-field"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Describe the item in detail (color, size, brand, distinguishing features...)"
                            className="input-field"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Where was it found? *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                            placeholder="e.g., Library 2nd Floor, Gym, Cafeteria"
                            className="input-field"
                        />
                    </div>

                    {/* Date Found */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Found *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.dateFound}
                            onChange={(e) =>
                                setFormData({ ...formData, dateFound: e.target.value })
                            }
                            className="input-field"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Photo (Optional but recommended)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-48 mx-auto rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer text-primary hover:text-secondary"
                                    >
                                        <span className="text-4xl block mb-2">📷</span>
                                        <span className="font-medium">Click to upload a photo</span>
                                        <span className="block text-sm text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </span>
                                    </label>
                                </>
                            )}
                        </div>
                    </div>

                    <hr className="my-6" />

                    <h3 className="text-lg font-semibold text-gray-800">
                        Your Contact Information
                    </h3>

                    {/* Finder Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.finderName}
                            onChange={(e) =>
                                setFormData({ ...formData, finderName: e.target.value })
                            }
                            placeholder="Enter your full name"
                            className="input-field"
                        />
                    </div>

                    {/* Finder Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.finderEmail}
                            onChange={(e) =>
                                setFormData({ ...formData, finderEmail: e.target.value })
                            }
                            placeholder="your.email@school.edu"
                            className="input-field"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Submit Found Item Report"}
                    </button>
                </div>
            </form>
        </div>
    );
}
