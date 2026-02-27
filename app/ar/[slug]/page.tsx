"use client";

import { use, useEffect, useState } from "react";
import { getImageUrl } from "@/lib/products";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_SLUG } from "@/lib/graphql/queries";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Image from "next/image";
import dynamic from "next/dynamic";

const DynamicARLauncher = dynamic(() => import("@/components/ar/ARLauncher"), {
    ssr: false,
    loading: () => <div className="animate-pulse text-primary font-bold">جاري تحميل المشغل...</div>
});

export default function ARViewerPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const [currentUrl, setCurrentUrl] = useState("");
    const [mounted, setMounted] = useState(false);

    const { data, loading: isLoading } = useQuery(GET_PRODUCT_BY_SLUG, {
        variables: { slug },
        skip: !slug
    });

    const product = data?.productBySlug;

    useEffect(() => {
        setMounted(true);
        setCurrentUrl(window.location.href);
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "";
            return /android|ipad|iphone|ipod/i.test(userAgent.toLowerCase());
        };
        setIsMobile(checkMobile());
    }, []);

    if (!mounted || isLoading || isMobile === null) {
        return (
            <main className="min-h-screen bg-transparent flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <span className="material-symbols-outlined text-6xl text-primary animate-spin">sync</span>
                    </div>
                    <p className="font-bold tracking-widest uppercase animate-pulse">جاري التحميل...</p>
                </div>
            </main>
        );
    }

    const getModelPath = (path?: string) => {
        if (!path) return "https://modelviewer.dev/shared-assets/models/Astronaut.glb"; // Generic fallback
        return getImageUrl(path);
    };

    const modelPath = getModelPath(product?.glbFileUrl);

    if (!product || !modelPath) {
        return (
            <main className="min-h-screen bg-transparent flex items-center justify-center text-white p-6" dir="rtl">
                <div className="text-center glass-aaa p-12 rounded-[3rem] border border-white/10 max-w-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />
                    <span className="material-symbols-outlined text-7xl text-red-500 mb-6 block">view_in_ar_off</span>
                    <h1 className="text-3xl font-black mb-4">العرض ثلاثي الأبعاد غير متوفر</h1>
                    <p className="text-gray-400 mb-8 text-lg">
                        عذراً، هذا المنتج لا يمتلك نموذجاً ثلاثي الأبعاد متاحاً حالياً للعرض في الواقع المعزز.
                    </p>
                    <Link href={`/products/${product?.slug || ''}`} className="btn-gaming bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-xl font-black transition-all inline-flex items-center gap-2">
                        <span className="material-symbols-outlined">arrow_forward</span>
                        العودة للمنتج
                    </Link>
                </div>
            </main>
        );
    }

    // DESKTOP VIEW
    if (!isMobile) {
        return (
            <main className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden pt-48 pb-12 px-6" dir="rtl">
                <AnimatedBackground />
                <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black to-secondary/10 pointer-events-none" />

                <div className="relative z-10 w-full max-w-5xl glass-aaa border border-white/10 rounded-[3rem] p-12 lg:p-16 flex flex-col md:flex-row items-center gap-16 shadow-2xl shadow-primary/5">

                    {/* Content */}
                    <div className="flex-1 text-right space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold uppercase tracking-wider mb-6">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                تجربة واقع معزز
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
                                استعرض <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent">{product.name}</span> في مساحتك الخاصة
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                للحصول على أفضل تجربة، استخدم جوالك. قم بمسح رمز الاستجابة السريعة (QR Code) لفتح الكاميرا ورؤية المنتج في غرفتك مباشرة.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 font-bold border-t border-white/5 pt-6">
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                                يدعم جميع الأجهزة الذكية
                            </span>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                        <div className="bg-white p-6 rounded-3xl relative z-10 shadow-xl transform group-hover:scale-105 transition-transform duration-500">
                            <QRCodeSVG
                                value={currentUrl}
                                size={250}
                                level="H"
                                includeMargin
                                imageSettings={{
                                    src: "/logo.png",
                                    x: undefined,
                                    y: undefined,
                                    height: 50,
                                    width: 50,
                                    excavate: true,
                                }}
                            />
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl pointer-events-none" />
                        </div>
                        <div className="text-center mt-6">
                            <p className="text-white font-bold text-lg mb-1">امسح الكود للجوال</p>
                            <p className="text-primary text-sm font-black uppercase tracking-widest animate-pulse">افتح الكاميرا للانطلاق</p>
                        </div>
                    </motion.div>
                </div>

                {/* Back Button */}
                <Link href={`/products/${product.slug}`} className="absolute top-10 right-10 flex items-center gap-3 text-white/50 hover:text-white transition-all group hover-lift">
                    <span className="text-lg font-bold">العودة للمنتج</span>
                    <div className="w-12 h-12 rounded-2xl glass-aaa border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:text-primary transition-all">
                        <span className="material-symbols-outlined rtl:rotate-180">arrow_back</span>
                    </div>
                </Link>
            </main>
        );
    }

    // MOBILE VIEW - DIRECT AR LAUNCHER
    return (
        <main className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center" dir="rtl">
            <AnimatedBackground />

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-accent/10 blur-[100px] pointer-events-none" />

            {/* Futuristic Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(176,38,255,0.8)] opacity-40"
                />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 p-5 flex items-center justify-between pointer-events-none">
                <Link
                    href={`/products/${product.slug}`}
                    className="w-12 h-12 glass-aaa rounded-2xl border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all pointer-events-auto"
                >
                    <span className="material-symbols-outlined">close</span>
                </Link>
                <div className="glass-aaa px-4 py-2.5 rounded-2xl border border-primary/30 flex items-center gap-2 pointer-events-auto">
                    <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(176,38,255,1)]" />
                    <p className="text-[10px] font-black text-white uppercase tracking-wider">نظام الواقع المعزز</p>
                </div>
            </header>

            {/* Launch UI */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <DynamicARLauncher modelPath={modelPath} productName={product.name} />

                <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
                        <span className="material-symbols-outlined text-primary text-sm animate-pulse">light_mode</span>
                        <p className="text-[11px] font-bold text-white/60 tracking-wide">الرجاء استخدام إضاءة جيدة</p>
                    </div>
                </div>
            </div>

            {/* Product Card Preview (bottom) */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", damping: 20 }}
                className="fixed bottom-8 left-5 right-5 z-30 glass-aaa border border-white/10 p-3.5 rounded-[2rem] flex items-center gap-4 shadow-2xl shadow-black"
            >
                <div className="w-14 h-14 bg-black/40 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 relative shadow-inner">
                    <Image
                        src={getImageUrl(product.mainImage || "default.jpg")}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 text-right overflow-hidden">
                    <p className="text-white font-bold text-sm truncate mb-0.5">{product.name}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-primary font-black text-sm tracking-tighter">
                            {product.price.toLocaleString()} ر.س
                        </span>
                        {product.stock > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-bold border border-green-500/20">
                                متوفر
                            </span>
                        )}
                    </div>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <Link
                    href={`/products/${product.slug}`}
                    className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">info</span>
                </Link>
            </motion.div>
        </main>
    );
}
