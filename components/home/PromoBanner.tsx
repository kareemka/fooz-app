"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CURRENCY } from "@/lib/constants";

const PromoBanner = () => {
    return (
        <section className="relative overflow-hidden w-full" style={{ minHeight: "70vh" }}>
            {/* Deep layered background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d0020] via-[#160830] to-[#04101e]" />

            {/* Animated glow orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-700/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-600/15 rounded-full blur-[80px]" />

            {/* Grid lines overlay */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Main content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-0 min-h-[70vh]">

                {/* Left – Text Block */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col items-start gap-6 max-w-2xl text-right order-2 lg:order-1"
                >
                    {/* Tag */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm font-bold"
                    >
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        عرض محدود
                    </motion.div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                        حزمة السيت أب{" "}
                        <span
                            className="relative inline-block"
                            style={{
                                background: "linear-gradient(90deg, #B026FF, #00F2FF)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            الاحترافي
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                        احصل على <strong className="text-white">خصم 20%</strong> عند شراء مكتب RGB وكرسي احترافي معاً. جهز غرفتك بالكامل بأقل سعر ممكن.
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-8 text-center mt-2">
                        <div>
                            <div className="text-3xl font-black text-white">20%</div>
                            <div className="text-xs text-gray-400 mt-0.5">خصم</div>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div>
                            <div className="text-3xl font-black text-white">500
                                <span className="text-xl text-purple-400 mr-1">{CURRENCY.SYMBOL}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">توفير</div>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div>
                            <div className="text-3xl font-black text-white">∞</div>
                            <div className="text-xs text-gray-400 mt-0.5">جودة</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Link
                            href="/products"
                            className="group relative px-8 py-4 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105"
                            style={{ background: "linear-gradient(135deg, #B026FF, #FF007F)" }}
                        >
                            <span className="relative z-10">استعرض الحزمة</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 rounded-2xl font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        >
                            تواصل معنا
                        </Link>
                    </div>
                </motion.div>

                {/* Right – Floating Card */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative flex-shrink-0 order-1 lg:order-2"
                >
                    {/* Outer glow ring */}
                    <div
                        className="absolute inset-0 rounded-3xl blur-2xl scale-110 opacity-60"
                        style={{ background: "linear-gradient(135deg, #B026FF40, #00F2FF30)" }}
                    />

                    <motion.div
                        animate={{ y: [0, -18, 0], rotate: [0, 1.5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-72 h-80 lg:w-80 lg:h-96 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-6 overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, rgba(176,38,255,0.12), rgba(0,242,255,0.08))",
                            backdropFilter: "blur(24px)",
                        }}
                    >
                        {/* Inner top bar */}
                        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

                        {/* Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl scale-150" />
                            <span
                                className="material-symbols-outlined text-[80px] relative"
                                style={{
                                    background: "linear-gradient(135deg, #B026FF, #00F2FF)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                sports_esports
                            </span>
                        </div>

                        {/* Savings badge */}
                        <div className="text-center px-8">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">وفر حتى</div>
                            <div
                                className="text-6xl font-black"
                                style={{
                                    background: "linear-gradient(90deg, #fff, #B026FF)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                500
                                <span className="text-3xl ml-1 text-cyan-400">{CURRENCY.SYMBOL}</span>
                            </div>
                        </div>

                        {/* Discount pill */}
                        <div
                            className="px-6 py-2 rounded-full text-white text-sm font-bold"
                            style={{ background: "linear-gradient(90deg, #B026FF, #FF007F)" }}
                        >
                            خصم 20% على الحزمة
                        </div>

                        {/* Bottom bar */}
                        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                    </motion.div>
                </motion.div>
            </div>

            {/* bottom fade to background */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0A0A1A] to-transparent" />
        </section>
    );
};

export default PromoBanner;
