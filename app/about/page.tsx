"use client";

import Container from "@/components/ui/Container";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Image from "next/image";

const AboutPage = () => {
    const stats = [
        { label: "عميل سعيد", value: "+10,000" },
        { label: "منتج احترافي", value: "+500" },
        { label: "سنة من الخبرة", value: "5" },
        { label: "بطولة برعايتنا", value: "12" },
    ];

    const values = [
        {
            title: "الجودة العالية",
            desc: "نختار بعناية أفضل المنتجات من أشهر العلامات التجارية العالمية لضمان أداء يدوم طويلاً.",
            icon: "verified"
        },
        {
            title: "دعم اللاعبين",
            desc: "نحن لسنا مجرد متجر، نحن جزء من مجتمع اللاعبين ونهتم بتطوير مهاراتكم وتوفير البيئة المثالية.",
            icon: "groups"
        },
        {
            title: "الابتكار المستمر",
            desc: "نواكب أحدث صيحات تكنولوجيا السيت أب والواقع المعزز لنضع المستقبل بين يديك.",
            icon: "rocket_launch"
        }
    ];

    return (
        <main className="min-h-screen bg-dark-bg text-white relative overflow-hidden" dir="rtl">
            <AnimatedBackground />
            {/* Hero Section */}
            <section className="pt-52 pb-32 relative">
                <Container>
                    <div className="flex flex-col items-center text-center gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold uppercase tracking-widest"
                        >
                            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                            تعرف علينا
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl md:text-7xl font-black leading-tight"
                        >
                            نرسم مستقبل <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent">تجربة اللعب</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="max-w-2xl text-gray-400 text-lg md:text-xl leading-relaxed"
                        >
                            في عالم الألعاب، نؤمن بأن كل لاعب يستحق التجربة الأفضل. بدأت رحلتنا بشغف بسيط للجيمنج، واليوم نحن فخورون لكوننا الوجهة المفضلة للاعبين المحترفين في المنطقة.
                        </motion.p>
                    </div>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white/[0.02] border-y border-white/5">
                <Container>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center flex flex-col gap-2"
                            >
                                <span className="text-4xl md:text-5xl font-black text-white">{stat.value}</span>
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Values Section */}
            <section className="py-32 relative">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index === 0 ? 20 : (index === 2 ? -20 : 0), y: 20 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="p-10 rounded-[2.5rem] bg-surface border border-white/5 hover:border-primary/30 transition-all duration-500 group"
                            >
                                <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-primary text-3xl">{value.icon}</span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">{value.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Mission Section */}
            <section className="py-32 bg-primary/5 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-transparent to-dark-bg"></div>
                <Container className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 backdrop-blur-sm p-12 rounded-[3rem] border border-white/5">
                        <div className="flex-1 flex flex-col gap-8">
                            <h2 className="text-4xl font-black text-white">رؤيتنا وما نسعى إليه</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                نسعى لأن نكون المرجع الأول للاعب العربي في تجهيز غرف الألعاب (Setup). نحن لا نبيع المنتجات فحسب، بل نصمم تجارب متكاملة تجمع بين الراحة، الأداء، والجمال البصري.
                            </p>
                            <div className="flex flex-col gap-4">
                                {[
                                    "توفير أحدث التقنيات العالمية في السوق المحلي.",
                                    "ضمان سلالة عملية التركيب والاستخدام.",
                                    "بناء علاقة ثقة طويلة الأمد مع عملائنا."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="size-2 bg-primary rounded-full"></div>
                                        <span className="text-gray-300 font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
                            <Image
                                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
                                alt="Gaming Setup"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
                        </div>
                    </div>
                </Container>
            </section>

        </main>
    );
};

export default AboutPage;
