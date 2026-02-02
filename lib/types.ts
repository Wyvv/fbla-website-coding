export interface FoundItem {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    dateFound: string;
    imageUrl: string | null;
    finderName: string;
    finderEmail: string;
    status: "pending" | "approved" | "claimed" | "rejected";
    createdAt: Date;
}

export interface ClaimRequest {
    id: string;
    itemId: string;
    claimantName: string;
    claimantEmail: string;
    claimantPhone: string;
    description: string;
    status: "pending" | "approved" | "rejected";
    createdAt: Date;
}

export type Category =
    | "Electronics"
    | "Clothing"
    | "Books"
    | "Accessories"
    | "Sports Equipment"
    | "Other";
