"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden" dir="rtl">
            <AnimatedBackground />

            <Container className="relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-aaa p-12 rounded-[3rem] border border-red-500/20 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />

                        <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                            <span className="material-symbols-outlined text-5xl text-red-500 animate-pulse">report</span>
                        </div>

                        <h1 className="text-3xl font-black text-white mb-4">حدث خطأ تقني!</h1>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed font-bold">
                            نعتذر منك، واجهنا مشكلة في تحميل هذه الصفحة. فريقنا يعمل على إصلاحها بأسرع وقت.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-gray-200 font-black rounded-2xl px-10"
                                onClick={() => reset()}
                            >
                                حاول مرة أخرى
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/10 text-white hover:bg-white/5 rounded-2xl px-10"
                                onClick={() => window.location.href = "/"}
                            >
                                العودة للرئيسية
                            </Button>
                        </div>

                        <p className="mt-8 text-xs text-gray-600 font-mono">
                            Error ID: {error.digest || 'unknown'}
                        </p>
                    </motion.div>
                </div>
            </Container>
        </main>
    );
}
