import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "School Lost & Found",
    description: "Modern lost and found system for schools",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-slate-50 min-h-screen">
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
        </body>
        </html>
    );
}
