"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const Features = () => {
    const features = [
        {
            icon: "bolt",
            title: "تصميم مستقبلي",
            desc: "واجهات مستوحاة من عالم الـ Esports الاحترافي",
            color: "text-primary",
            glow: "shadow-[0_0_30px_rgba(176,38,255,0.3)]",
        },
        {
            icon: "palette",
            title: "إضاءة RGB",
            desc: "تحكم كامل في الألوان لتناسب أسلوب لعبك",
            color: "text-secondary",
            glow: "shadow-[0_0_30px_rgba(255,0,127,0.3)]",
        },
        {
            icon: "verified_user",
            title: "جودة عالية",
            desc: "خامات AAA مصممة لتدوم في أصعب المعارك",
            color: "text-accent",
            glow: "shadow-[0_0_30px_rgba(0,242,255,0.3)]",
        },
    ];

    return (
        <section className="py-32 relative overflow-hidden">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.8 }}
                            whileHover={{ y: -15, scale: 1.02 }}
                            className={cn(
                                "group p-12 glass-aaa rounded-[3rem] border border-white/10 transition-all duration-500 hover:border-white/20 relative overflow-hidden",
                                f.glow
                            )}
                        >
                            {/* Background Glow */}
                            <div className={cn("absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full", f.color.replace('text-', 'bg-'))} />

                            <div className={cn("mb-10 p-6 glass-pill inline-block transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12", f.color)}>
                                <span className="material-symbols-outlined text-[48px] leading-none block">{f.icon}</span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase">{f.title}</h3>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium opacity-80">
                                {f.desc}
                            </p>

                            {/* Bottom Accent Line */}
                            <div className={cn("absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700", f.color.replace('text-', 'bg-'))} />
                        </motion.div>
                    ))}
                </div>
            </Container>

            {/* Background RGB streak */}
            <div className="rgb-streak w-full top-1/2 left-0 opacity-10" />
        </section>
    );
};

export default Features;
