"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/store";
import CartDrawer from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/lib/wishlist-store";

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { getItemCount: getCartItemCount } = useCart();
    const { getItemCount: getWishlistItemCount } = useWishlist();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Update search query when URL param changes
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery.trim()) {
            params.set("search", searchQuery.trim());
        } else {
            params.delete("search");
        }
        router.push(`/products?${params.toString()}`);
    };

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "الرئيسية", href: "/", icon: "home" },
        { name: "المنتجات", href: "/products", icon: "inventory_2" },
        { name: "من نحن", href: "/about", icon: "info" },
        { name: "تواصل معنا", href: "/contact", icon: "mail" },
        { name: "الاسئلة الشائعة", href: "/faq", icon: "help" },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-[1400px] mx-auto w-full flex flex-col">
                    {/* Top Tier: Logo, Search, Actions */}
                    <div className="flex items-center justify-between px-4 md:px-10 py-3 md:py-4 gap-4 md:gap-8">
                        {/* Mobile Menu Button - Premium Gaming Style */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden flex items-center justify-center size-11 rounded-xl bg-gradient-to-br from-white/10 to-white/5 text-white hover:text-primary transition-all backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(176,38,255,0.15)] group relative"
                            aria-label="فتح القائمة"
                        >
                            <div className="flex flex-col gap-1.5 w-6">
                                <motion.span
                                    className="h-0.5 w-full bg-current rounded-full"
                                    animate={{ width: isMobileMenuOpen ? "100%" : "100%" }}
                                />
                                <motion.span
                                    className="h-0.5 w-3/4 bg-gradient-to-r from-primary to-secondary rounded-full"
                                    animate={{ width: isMobileMenuOpen ? "100%" : "75%" }}
                                />
                                <motion.span
                                    className="h-0.5 w-full bg-current rounded-full"
                                    animate={{ width: isMobileMenuOpen ? "100%" : "100%" }}
                                />
                            </div>

                            {/* Scanning line effect */}
                            <div className="absolute inset-0 overflow-hidden rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent h-1/2 w-full animate-scan" />
                            </div>
                        </motion.button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 text-white shrink-0 group">
                            <Image
                                src="/fooz-logo.png"
                                alt="FOOZ Gaming Logo"
                                width={140}
                                height={50}
                                className="h-9 md:h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(176,38,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(0,242,255,0.4)] transition-all"
                                priority
                            />
                        </Link>

                        <div className="hidden md:flex flex-1 max-w-[600px]">
                            <form onSubmit={handleSearch} className="flex w-full cursor-text items-center rounded-full bg-white/5 border border-white/5 focus-within:border-primary/40 focus-within:bg-black/40 focus-within:shadow-[0_0_20px_rgba(176,38,255,0.15)] transition-all px-4 py-2">
                                <span className="material-symbols-outlined text-gray-400 ms-3">search</span>
                                <input
                                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none border-none focus:ring-0 p-0 text-right"
                                    placeholder="ابحث عن منتجات..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white text-xs font-bold px-5 py-1.5 rounded-full transition-all duration-300 shadow-lg shadow-primary/20">بحث</button>
                            </form>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 md:gap-4 shrink-0">
                            <Link href="/wishlist" className="hidden sm:flex items-center justify-center size-10 rounded-full hover:bg-white/10 text-gray-300 hover:text-secondary transition-colors relative group">
                                <span className="material-symbols-outlined">favorite</span>
                                {mounted && getWishlistItemCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-lg">
                                        {getWishlistItemCount()}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="flex items-center justify-center size-10 rounded-xl hover:bg-white/5 text-gray-300 hover:text-accent transition-all relative border border-transparent hover:border-white/10"
                            >
                                <span className="material-symbols-outlined">shopping_bag</span>
                                {mounted && getCartItemCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-[9px] font-bold text-white shadow-lg">
                                        {getCartItemCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Bottom Tier: Nav Links (Desktop) */}
                    <div className="hidden md:flex justify-center border-t border-white/5 py-2 bg-white/[0.01]">
                        <nav className="flex gap-1 items-center bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "relative px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                                            isActive ? "text-white" : "text-white/60 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-active"
                                                className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Mobile Search - More Compact */}
                    <div className="md:hidden px-4 pb-3">
                        <form onSubmit={handleSearch} className="flex w-full cursor-text items-center rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                            <span className="material-symbols-outlined text-white/40 ms-2 text-[20px]">search</span>
                            <input
                                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none border-none focus:ring-0 p-0 text-right"
                                placeholder="ابحث..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-[#0A0A1A] z-[70] shadow-2xl border-l border-white/10 flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Image
                                        src="/fooz-logo.png"
                                        alt="FOOZ Gaming"
                                        width={110}
                                        height={40}
                                        className="h-9 w-auto object-contain"
                                    />
                                </Link>
                                <motion.button
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-primary transition-all border border-white/5 hover:border-primary/30"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </motion.button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5">
                                {navLinks.map((link, index) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300",
                                                    isActive
                                                        ? "bg-primary/20 text-white border border-primary/30"
                                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                <span className={cn(
                                                    "material-symbols-outlined text-[20px]",
                                                    isActive ? "text-primary" : ""
                                                )}>{link.icon}</span>
                                                <span className="font-medium">{link.name}</span>
                                                {isActive && (
                                                    <span className="ms-auto size-1.5 rounded-full bg-primary shadow-glow shadow-primary" />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </nav>

                            {/* Drawer Footer */}
                            <div className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-3">
                                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/60 hover:text-secondary transition-all relative border border-white/5">
                                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    <span className="text-sm">المفضلة</span>
                                    {mounted && getWishlistItemCount() > 0 && (
                                        <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white shadow-md">
                                            {getWishlistItemCount()}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Navbar;
