"use client";

import React from "react";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/product/ProductCard";
import { useWishlist } from "@/lib/wishlist-store";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function WishlistPage() {
    const { items } = useWishlist();

    return (
        <main className="min-h-screen bg-transparent text-white" dir="rtl">
            <AnimatedBackground />

            <div className="pt-44 pb-32">
                <Container>
                    <div className="flex flex-col gap-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl md:text-5xl font-black text-white"
                            >
                                المفضلة
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-gray-400 text-lg"
                            >
                                {items.length > 0
                                    ? `لديك ${items.length} منتجات في قائمتك المفضلة`
                                    : "قائمة المفضلة لديك فارغة حالياً"}
                            </motion.p>
                        </div>

                        {items.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                                {items.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm"
                            >
                                <span className="material-symbols-outlined text-8xl text-gray-600 mb-6 drop-shadow-lg">
                                    heart_broken
                                </span>
                                <h2 className="text-2xl font-bold text-white mb-4">لا توجد منتجات في المفضلة</h2>
                                <p className="text-gray-400 mb-8 max-w-md text-center">
                                    لم تقم بإضافة أي منتجات إلى قائمتك المفضلة بعد. تصفح منتجاتنا وأضف ما يعجبك!
                                </p>
                                <Link
                                    href="/products"
                                    className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-xl hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">explore</span>
                                    تصفح المنتجات
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </Container>
            </div>

        </main>
    );
}
