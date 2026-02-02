"use client";

import { FoundItem } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

interface ItemCardProps {
    item: FoundItem;
}

export default function ItemCard({ item }: ItemCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const statusConfig = {
        pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            icon: "⏳",
        },
        approved: {
            bg: "bg-green-100",
            text: "text-green-800",
            icon: "✅",
        },
        claimed: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            icon: "🎉",
        },
        rejected: {
            bg: "bg-red-100",
            text: "text-red-800",
            icon: "❌",
        },
    };

    const status = statusConfig[item.status];

    return (
        <div className="card-modern group animate-fade-in">
            {/* Image */}
            <div className="aspect-[4/3] bg-gradient-to-br from-dark-100 to-dark-200 relative overflow-hidden">
                {item.imageUrl ? (
                    <>
                        {!imageLoaded && (
                            <div className="absolute inset-0 skeleton" />
                        )}
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                                imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-6xl opacity-30">📦</span>
                            <p className="text-dark-400 text-sm mt-2">No image available</p>
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
          <span
              className={`badge ${status.bg} ${status.text} shadow-md backdrop-blur-sm`}
          >
            <span className="mr-1">{status.icon}</span>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 text-dark-700 shadow-md backdrop-blur-sm">
            {item.category}
          </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-dark-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {item.title}
                </h3>

                {/* Description */}
                <p className="text-dark-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-dark-500">
                        <span className="mr-2">📍</span>
                        <span className="line-clamp-1">{item.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-dark-500">
                        <span className="mr-2">📅</span>
                        <span>{new Date(item.dateFound).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Action Button */}
                {item.status === "approved" && (
                    <Link
                        href={`/claim/${item.id}`}
                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    >
                        Claim This Item →
                    </Link>
                )}

                {item.status === "pending" && (
                    <div className="text-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl text-sm font-medium">
                        Pending Review
                    </div>
                )}

                {item.status === "claimed" && (
                    <div className="text-center px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                        Already Claimed
                    </div>
                )}
            </div>
        </div>
    );
}
