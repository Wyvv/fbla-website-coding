"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Home", icon: "🏠" },
        { href: "/items", label: "Browse", icon: "🔍" },
        { href: "/report", label: "Report", icon: "📝" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-lg shadow-lg"
                    : "bg-white/80 backdrop-blur-sm"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <div className="hidden sm:block">
              <span className="text-xl font-bold text-dark-900 group-hover:text-primary-600 transition-colors">
                Lost & Found
              </span>
                            <p className="text-xs text-dark-500 -mt-0.5">School Community</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                    isActive(link.href)
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-dark-700 hover:bg-dark-50"
                                }`}
                            >
                                <span className="text-lg">{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}<Link
                        href="/admin"
                        className="ml-4 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Admin
                    </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-dark-100 transition-colors"
                    >
                        <svg
                            className="h-6 w-6 text-dark-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-dark-100 animate-fade-in">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                                        isActive(link.href)
                                            ? "bg-primary-50 text-primary-700"
                                            : "text-dark-700 hover:bg-dark-50"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                            <Link
                                href="/admin"
                                className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold shadow-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="text-xl">⚙️</span>
                                <span>Admin Panel</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
