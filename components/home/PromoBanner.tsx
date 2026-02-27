"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Container from "@/components/ui/Container";
// import Button from "@/components/ui/Button";
import { CURRENCY } from "@/lib/constants";

const PromoBanner = () => {
    return (
        <section className="py-12 relative overflow-hidden">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-12 relative border border-white/10 shadow-neon"
                >
                    {/* Background Accents */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    {/* Left: Text Content */}
                    <div className="relative z-10 flex flex-col items-start gap-6 max-w-2xl text-right">
                        <div className="inline-block px-4 py-1 bg-white/10 rounded-full border border-white/20 text-accent font-bold text-sm">عرض محدود</div>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">حزمة السيت أب <span className="text-accent">الاحترافي</span></h2>
                        <p className="text-gray-200 text-lg leading-relaxed max-w-xl">
                            احصل على خصم 20% عند شراء مكتب RGB وكرسي احترافي معاً. جهز غرفتك بالكامل بأقل سعر.
                        </p>
                        <Link href="/products" className="mt-4 bg-white text-indigo-900 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg inline-block text-center">
                            استعرض الحزمة
                        </Link>
                    </div>

                    {/* Right: Floating Visual */}
                    <div className="relative z-10 mt-12 md:mt-0 w-full md:w-1/3 flex justify-center">
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-64 h-64"
                        >
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative w-full h-full bg-white/5 backdrop-blur-2xl rounded-2xl flex flex-col items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] group hover:border-accent/50 transition-colors">
                                <span className="material-symbols-outlined text-[60px] text-accent mb-2 drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">sports_esports</span>
                                <div className="text-center">
                                    <span className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">وفر حتى</span>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-5xl font-black text-white drop-shadow-md">500</span>
                                        <span className="text-xl font-bold text-accent">{CURRENCY.SYMBOL}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
};

export default PromoBanner;
