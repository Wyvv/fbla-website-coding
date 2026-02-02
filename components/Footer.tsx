import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-dark-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                                <span className="text-xl">🔍</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">School Lost & Found</h3>
                                <p className="text-xs text-dark-400">Reuniting belongings</p>
                            </div>
                        </div>
                        <p className="text-dark-400 mb-4 max-w-md">
                            A modern platform helping our school community reunite with their
                            lost belongings. Report, search, and claim items efficiently.
                        </p>
                        <div className="flex space-x-4">
                            <button className="w-10 h-10 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors flex items-center justify-center">
                                📧
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors flex items-center justify-center">
                                📱
                            </button>
                            <button className="w-10 h-10 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors flex items-center justify-center">
                                💬
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-dark-300">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/items"
                                    className="text-dark-400 hover:text-white transition-colors"
                                >
                                    Browse Items
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/report"
                                    className="text-dark-400 hover:text-white transition-colors"
                                >
                                    Report Found Item
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin"
                                    className="text-dark-400 hover:text-white transition-colors"
                                >
                                    Admin Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 text-dark-300">Contact</h4>
                        <ul className="space-y-3 text-dark-400">
                            <li className="flex items-center space-x-2">
                                <span>📍</span>
                                <span>School Main Office</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span>📧</span>
                                <span>lostandfound@school.edu</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span>📞</span>
                                <span>(555) 123-4567</span>
                            </li></ul>
                    </div>
                </div>

                <div className="border-t border-dark-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-dark-400 text-sm">
                        © 2025 School Lost & Found. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <Link
                            href="#"
                            className="text-dark-400 hover:text-white text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-dark-400 hover:text-white text-sm transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
