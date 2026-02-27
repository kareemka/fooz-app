"use client";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { CONTACT_INFO } from "@/lib/constants";

const ContactPage = () => {
    const contactInfo = [
        {
            title: "البريد الإلكتروني",
            description: "فريقنا الودود موجود هنا للمساعدة.",
            value: CONTACT_INFO.EMAIL,
            link: `mailto:${CONTACT_INFO.EMAIL}`,
            icon: "mail",
            color: "primary"
        },
        {
            title: "رقم الهاتف",
            description: "متاحون طوال أيام الأسبوع لخدمتكم.",
            value: CONTACT_INFO.PHONE,
            link: `tel:${CONTACT_INFO.PHONE.replace(/\s+/g, '')}`,
            icon: "phone",
            color: "secondary"
        },
        {
            title: "الموقع",
            description: "المقر الرئيسي في العراق.",
            value: CONTACT_INFO.ADDRESS,
            link: "#",
            icon: "location_on",
            color: "accent"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] selection:bg-primary/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <AnimatedBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/80 pointer-events-none" />
            </div>

            <section className="pt-44 pb-32 relative z-10" dir="rtl">
                <Container>
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-primary backdrop-blur-md"
                        >
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            مركز الاتصال والخدمة
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight"
                        >
                            نحن هنا <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">لمساعدتك</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed"
                        >
                            انضم إلى مجتمعنا واحصل على الدعم الفني الذي تحتاجه. نحن نهتم بتجربتك ونسعى دائماً لتطويرها.
                        </motion.p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
                    >
                        {contactInfo.map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="glass p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-300 relative z-10 text-center h-full flex flex-col items-center">
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 bg-${item.color}/10 text-${item.color} group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-${item.color}/5`}>
                                        <span className="material-symbols-outlined text-[40px]">{item.icon}</span>
                                    </div>
                                    <h3 className="text-white font-bold text-2xl mb-3">{item.title}</h3>
                                    <p className="text-gray-400 mb-6 text-sm">{item.description}</p>
                                    <a
                                        href={item.link}
                                        className="mt-auto text-white font-medium hover:text-primary transition-colors text-lg dir-ltr"
                                    >
                                        {item.value}
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-center"
                    >
                        <a
                            href={CONTACT_INFO.WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            <Button className="relative flex items-center gap-4 px-10 py-6 text-xl bg-[#25D366] hover:bg-[#128C7E] border-none text-white rounded-2xl transition-all duration-300 shadow-xl shadow-green-500/20">
                                <svg
                                    className="w-8 h-8 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                >
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.3 2.5-2.4 5.5-6.4 8.3-9.6 2.8-3.2 3.7-5.5 5.5-9.3 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                </svg>
                                <span>تواصل معنا عبر واتساب</span>
                            </Button>
                        </a>
                    </motion.div>
                </Container>
            </section>
        </main>
    );
};

export default ContactPage;
