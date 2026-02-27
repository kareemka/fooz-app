"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ModelViewerElement extends HTMLElement {
    canActivateAR: boolean;
    activateAR: () => void;
}

interface ARLauncherProps {
    modelPath: string;
    productName: string;
}

export default function ARLauncher({ modelPath, productName }: ARLauncherProps) {
    const arTriggerRef = useRef<ModelViewerElement>(null);

    useEffect(() => {
        import("@google/model-viewer");
    }, []);

    return (
        <div className="relative z-10 w-full max-w-md text-center space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                    <span className="material-symbols-outlined text-5xl text-primary animate-bounce-subtle">view_in_ar</span>
                </div>
                <h1 className="text-3xl font-black text-white leading-tight">
                    عرض <span className="text-primary">{productName}</span> في غرفتك
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                    اضغط على الزر أدناه لفتح الكاميرا ومسح الأرضية لرؤية المنتج بالحجم الحقيقي في مساحتك.
                </p>
            </motion.div>

            {/* Hidden AR Model - must be in DOM but not visible */}
            <div className="opacity-0 pointer-events-none absolute inset-0 size-1 overflow-hidden">
                <model-viewer
                    ref={arTriggerRef}
                    id="ar-trigger"
                    src={modelPath}
                    ar
                    ar-modes="scene-viewer quick-look webxr"
                    ar-placement="floor"
                    ar-scale="fixed"
                    camera-controls
                    shadow-intensity="1"
                    exposure="1"
                    alt={productName}
                />
            </div>

            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    const mv = arTriggerRef.current;
                    if (!mv) {
                        alert("عذراً، نظام الواقع المعزز قيد التحميل...");
                        return;
                    }

                    // Standard model-viewer activation flow
                    if (mv.canActivateAR) {
                        mv.activateAR();
                    } else {
                        alert("عذراً، جهازك لا يدعم تقنية الواقع المعزز (AR) حالياً.");
                    }
                }}
                className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-active:translate-x-0 transition-transform duration-300" />
                <span className="material-symbols-outlined text-3xl">camera</span>
                بدء تجربة الواقع المعزز
            </motion.button>

            <div className="pt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    الرجاء استخدام إضاءة جيدة
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                </div>
            </div>
        </div>
    );
}
