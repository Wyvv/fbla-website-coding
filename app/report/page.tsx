"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ReportPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        location: "",
        dateFound: "",
        finderName: "",
        finderEmail: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [loading, setLoading] = useState(false);

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

        try {
            let imageUrl = "";

            // Upload image if provided
            if (image) {
                console.log("Uploading image...");
                const imageRef = ref(storage, `items/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
                console.log("Image uploaded successfully");
            }

            // Add document to Firestore
            console.log("Submitting to Firestore...");
            const docRef = await addDoc(collection(db, "items"), {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                location: formData.location,
                dateFound: formData.dateFound,
                finderName: formData.finderName,
                finderEmail: formData.finderEmail,
                imageUrl,
                status: "pending",
                createdAt: serverTimestamp(),
            });
            console.log("Item added to Firestore with ID:", docRef.id);

            // Send thank you email
            console.log("Sending confirmation email...");
            try {
                const emailResponse = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.finderEmail,
                        name: formData.finderName,
                        itemTitle: formData.title,
                    }),
                });

                if (emailResponse.ok) {
                    console.log("Email sent successfully");
                } else {
                    const error = await emailResponse.json();
                    console.error('Email failed:', error);
                }
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Continue even if email fails
            }

            // Show success message and redirect
            alert("✅ Item reported successfully! An admin will review it shortly.\n\nCheck your email for confirmation.");

            // Reset form
            setFormData({
                title: "",
                category: "",
                description: "",
                location: "",
                dateFound: "",
                finderName: "",
                finderEmail: "",
            });
            setImage(null);
            setImagePreview("");

            // Redirect to home page
            router.push("/");
        } catch (error) {
            console.error("❌ Error submitting item:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to submit item: ${errorMessage}\n\nPlease check the console for details.`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Report a Found Item 📦
                    </h1>
                    <p className="text-lg text-gray-600">
                        Help reunite lost items with their owners
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                    {/* Item Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Item Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="e.g., Blue Water Bottle"
                        />
                    </div>

                    {/* Category and Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            >
                                <option value="">Select category</option>
                                <option value="Electronics">📱 Electronics</option>
                                <option value="Clothing">👕 Clothing</option>
                                <option value="Books">📚 Books</option>
                                <option value="Sports Equipment">⚽ Sports Equipment</option>
                                <option value="Accessories">👜 Accessories</option>
                                <option value="Other">📦 Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location Found *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                placeholder="e.g., Library 2nd Floor"
                            />
                        </div>
                    </div>

                    {/* Date and Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date Found *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.dateFound}
                            onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div><div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description *
                    </label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        rows={4}
                        placeholder="Provide detailed description to help identify the owner..."
                    />
                </div>

                    {/* Image Upload with Preview */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload Photo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Finder Information */}
                    <div className="border-t-2 border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Your Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.finderName}
                                    onChange={(e) => setFormData({ ...formData, finderName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.finderEmail}
                                    onChange={(e) => setFormData({ ...formData, finderEmail: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="your.email@school.edu"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    We'll send you a confirmation email
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>Submitting...
              </span>
                        ) : (
                            "Submit Report"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
