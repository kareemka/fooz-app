"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Container from "@/components/ui/Container";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden" dir="rtl">
            <AnimatedBackground />
            <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

            <Container className="relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="glass-aaa p-12 lg:p-16 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary" />

                        <h1 className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none mb-4">
                            404
                        </h1>

                        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
                            <span className="material-symbols-outlined text-5xl text-primary animate-bounce">search_off</span>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-4">عذراً، الصفحة غير موجودة!</h2>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed font-bold">
                            يبدو أنك سلكت طريقاً خاطئاً في عالم الألعاب. الصفحة التي تبحث عنها قد تم نقلها أو حذفها.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="px-10 py-5 bg-white text-black hover:bg-gray-200 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">home</span>
                                العودة للرئيسية
                            </Link>
                            <Link
                                href="/products"
                                className="px-10 py-5 glass-aaa border border-white/10 text-white hover:bg-white/5 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
                            >
                                تصفح المنتجات
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </main>
    );
}
