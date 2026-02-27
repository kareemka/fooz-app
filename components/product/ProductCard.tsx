"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Product, getImageUrl } from "@/lib/products";
import { cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-store";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { toggleFavorite, isFavorite: checkFavorite } = useWishlist();
    const isFavorite = checkFavorite(product.id);

    const sizes = product.sizes || [];

    // Price Logic with Percentage Discount:
    // Discount percentage applies to both base price and size prices

    let price = 0;
    let finalPrice = 0;
    const hasDiscount = !!(product.discountPercentage && product.discountPercentage > 0);

    if (sizes.length > 0) {
        // Use first size price
        price = sizes[0].price;
        // Apply discount percentage to size price
        finalPrice = hasDiscount ? price * (1 - product.discountPercentage! / 100) : price;
    } else {
        // Use base product price
        price = product.price || 0;
        // Apply discount percentage to base price
        finalPrice = hasDiscount ? price * (1 - product.discountPercentage! / 100) : price;
    }

    const discountPercentageDisplay = hasDiscount ? product.discountPercentage! : 0;

    const mainImage = product.mainImage || product.imagePaths?.[0]?.path || "";



    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group relative flex flex-col bg-card-bg rounded-xl md:rounded-2xl border border-white/5 hover:border-primary/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]"
        >
            {/* Transparent link overlay */}
            <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-10" />

            {/* Image Container - تم تغيير aspect-[3/4] إلى aspect-[4/3] */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface/50">
                {/* Wishlist Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleFavorite}
                    className={cn(
                        "absolute top-2 left-2 md:top-3 md:left-3 z-20 size-8 md:size-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 border",
                        isFavorite
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-black/40 text-gray-400 border-white/10 hover:border-primary/50 hover:text-primary"
                    )}
                >
                    <span className={cn(
                        "material-symbols-outlined text-[18px] md:text-[22px] transition-all",
                        isFavorite && "fill-current"
                    )}>
                        favorite
                    </span>
                </motion.button>

                {/* AR Badge */}
                {product.model3dPath && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute bottom-2 left-2 md:bottom-3 md:left-3 z-20 px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-accent/90 to-cyan-500/90 backdrop-blur-md text-white text-[10px] md:text-xs font-bold rounded-lg border border-accent/30 flex items-center gap-1 shadow-lg"
                    >
                        <span className="material-symbols-outlined text-[14px] md:text-[16px]">view_in_ar</span>
                        <span className="hidden sm:inline">معاينة AR</span>
                        <span className="sm:hidden">AR</span>
                    </motion.div>
                )}

                {/* Discount/New Badge */}
                <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                    {hasDiscount ? (
                        <motion.div
                            initial={{ rotate: -12 }}
                            whileHover={{ rotate: 0, scale: 1.05 }}
                            className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] md:text-sm font-black rounded-lg shadow-lg"
                        >
                            <span className="hidden sm:inline">خصم </span>{discountPercentageDisplay}٪
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ rotate: 12 }}
                            whileHover={{ rotate: 0, scale: 1.05 }}
                            className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-br from-accent to-cyan-500 text-black text-[10px] md:text-sm font-black rounded-lg shadow-lg"
                        >
                            جديد
                        </motion.div>
                    )}
                </div>

                {/* Product Image */}
                <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full h-full relative"
                >
                    <Image
                        src={getImageUrl(mainImage)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </motion.div>

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick Actions on Hover */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-col gap-2">


                        {/* Quick View Button */}
                        <Link
                            href={`/products/${product.slug || product.id}`}
                            className="relative z-30 w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            عرض سريع
                        </Link>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4 flex flex-col gap-1.5 md:gap-2 relative z-20" dir="rtl">
                {/* Rating */}
                <div className="flex items-center gap-1">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "material-symbols-outlined text-[12px] md:text-[16px]",
                                    i < 4 ? "text-yellow-400 fill-current" : "text-gray-600"
                                )}
                            >
                                star
                            </span>
                        ))}
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-400 font-medium">(4.8)</span>
                </div>

                {/* Product Name */}
                <Link
                    href={`/products/${product.slug || product.id}`}
                    className="relative z-30"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-white text-sm md:text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[2.25rem] md:min-h-[2.5rem]">
                        {product.name}
                    </h3>
                </Link>

                {/* Category */}
                <p className="text-gray-500 text-[10px] md:text-xs font-medium">{product.category?.name}</p>

                {/* Price & Availability */}
                <div className="flex items-end justify-between mt-1.5 md:mt-2 pt-2 md:pt-3 border-t border-white/5">
                    <div className="flex flex-col items-start gap-0.5 md:gap-1">
                        <span className="text-primary text-lg md:text-2xl font-black">
                            {finalPrice.toLocaleString()}
                            <span className="text-[10px] md:text-sm mr-0.5 md:mr-1">{CURRENCY.SYMBOL}</span>
                        </span>
                        {hasDiscount && (
                            <span className="text-gray-500 text-[10px] md:text-sm line-through decoration-red-500">
                                {price.toLocaleString()} {CURRENCY.SYMBOL}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        {product.stock > 0 ? (
                            <span className="px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-md bg-green-500/10 text-green-400 text-[8px] md:text-[10px] font-bold border border-green-500/20 flex items-center gap-0.5 md:gap-1">
                                <span className="size-1 md:size-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                متوفر
                            </span>
                        ) : (
                            <span className="px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-md bg-red-500/10 text-red-400 text-[8px] md:text-[10px] font-bold border border-red-500/20 flex items-center gap-0.5 md:gap-1">
                                <span className="size-1 md:size-1.5 bg-red-400 rounded-full"></span>
                                غير متوفر
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;