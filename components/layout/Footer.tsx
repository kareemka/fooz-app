"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Facebook,
    Instagram,
    Mail,
    Phone,
    MapPin,
    // Send
} from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const Footer = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <footer className="relative bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 overflow-hidden" dir="rtl">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-10 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16"
                >
                    {/* Branding */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-6 items-start">
                        <Link href="/" className="block group">
                            <div className="relative">
                                <Image
                                    src="/fooz-logo.png"
                                    alt="FOOZ Gaming Logo"
                                    width={160}
                                    height={60}
                                    className="h-16 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(176,38,255,0.5)]"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            اجمل التصاميم
                            لافضل المنتجات
                            باعلى جودة
                            ومن مصدر موثوق
                            اهلاً بك في عالم FOOZ✨
                        </p>
                        <div className="flex gap-4 mt-2">
                            {[
                                { icon: Facebook, href: "https://www.facebook.com/fooz.gaming/", color: "hover:bg-[#1877f2]" },
                                { icon: Instagram, href: "https://www.instagram.com/fooz.gaming/", color: "hover:bg-[#e4405f]" },
                                {
                                    icon: ({ size = 18, className }: { size?: number, className?: string }) => (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={size}
                                            height={size}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={className}
                                        >
                                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                        </svg>
                                    ),
                                    href: "https://www.tiktok.com/@fooz.gaming",
                                    color: "hover:bg-[#000000] hover:border-[#25F4EE]"
                                },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.color}`}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links - Hidden on Mobile */}
                    <motion.div variants={itemVariants} className="hidden md:flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg relative inline-block">
                            روابط سريعة
                            <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-gradient-to-l from-primary to-transparent"></span>
                        </h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "من نحن", href: "/about" },
                                { label: "الأسئلة الشائعة", href: "/faq" },
                                { label: "المنتجات", href: "/products" },
                                { label: "المفضلة", href: "/wishlist" },
                                { label: "اتصل بنا", href: "/contact" },
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="text-gray-400 text-sm hover:text-primary transition-all flex items-center gap-2 group w-fit"
                                >
                                    <span className="size-1.5 bg-white/20 rounded-full group-hover:bg-primary group-hover:w-4 transition-all duration-300"></span>
                                    <span className="group-hover:translate-x-[-4px] transition-transform">{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg relative inline-block">
                            تواصل معنا
                            <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-gradient-to-l from-secondary to-transparent"></span>
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3 text-gray-400 group">
                                <div className="mt-1 size-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium mb-1">العنوان</p>
                                    <p className="text-xs leading-relaxed">
                                        {CONTACT_INFO.ADDRESS}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 group">
                                <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium mb-1">الهاتف</p>
                                    <p className="text-xs" dir="ltr">{CONTACT_INFO.PHONE}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 group">
                                <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium mb-1">البريد الإلكتروني</p>
                                    <p className="text-xs">{CONTACT_INFO.EMAIL}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Newsletter */}
                    {/* <motion.div variants={itemVariants} className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg relative inline-block">
                            انضم للنخبة
                            <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-gradient-to-l from-accent to-transparent"></span>
                        </h3>
                        <p className="text-gray-400 text-sm">كن أول من يحصل على العروض الحصرية وتحديثات المنتجات الجديدة.</p>
                        <form className="flex flex-col gap-3 w-full group">
                            <div className="relative">
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder:text-gray-500"
                                    placeholder="البريد الإلكتروني"
                                    type="email"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            </div>
                            <button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-sm font-bold px-4 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:shadow-[0_0_30px_rgba(176,38,255,0.5)] active:scale-[0.98] flex items-center justify-center gap-2">
                                <span>اشتراك الآن</span>
                                <Send size={16} className="-rotate-180" />
                            </button>
                        </form>
                    </motion.div> */}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <p className="text-gray-500 text-sm text-center md:text-right">
                        © {new Date().getFullYear()} <span className="text-primary font-bold">FOOZ Gaming</span>. جميع الحقوق محفوظة.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;