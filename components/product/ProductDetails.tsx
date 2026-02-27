"use client";

import { useState, useCallback, useMemo } from "react";
import Container from "@/components/ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { getImageUrl, Product } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist-store";
import Image from "next/image";

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { addItem } = useCart();
    const { toggleFavorite, isFavorite: checkFavorite } = useWishlist();
    const isFavorite = checkFavorite(product.id);

    const surfaceColors = useMemo(() => product.surfaceColors || [], [product.surfaceColors]);
    const edgeColors = useMemo(() => product.edgeColors || [], [product.edgeColors]);
    const sizes = useMemo(() => product.sizes || [], [product.sizes]);
    const accessories = useMemo(() => product.accessories || [], [product.accessories]);

    const [activeSurfaceColor, setActiveSurfaceColor] = useState(surfaceColors.length > 0 ? surfaceColors[0]?.id : null);
    const [activeEdgeColor, setActiveEdgeColor] = useState(edgeColors.length > 0 ? edgeColors[0]?.id : null);
    const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[0] : null);
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);


    // Refined Price Logic with Percentage Discount:
    // Discount percentage now applies to BOTH base price AND size prices

    let basePrice = 0;
    let finalPrice = 0;
    const hasDiscount = !!(product.discountPercentage && product.discountPercentage > 0);

    if (sizes.length > 0) {
        // Use selected size price or default to product price
        basePrice = selectedSize?.price || product.price || 0;
        // Apply discount percentage to size price
        finalPrice = hasDiscount ? basePrice * (1 - product.discountPercentage! / 100) : basePrice;
    } else {
        // Use base product price
        basePrice = product.price || 0;
        // Apply discount percentage to base price
        finalPrice = hasDiscount ? basePrice * (1 - product.discountPercentage! / 100) : basePrice;
    }

    const discountPercentageDisplay = hasDiscount ? product.discountPercentage! : 0;


    const accessoriesTotal = accessories
        .filter((acc) => selectedAccessories.includes(acc.id))
        .reduce((sum: number, acc) => sum + acc.price, 0);

    const totalPrice = finalPrice + accessoriesTotal;

    const images = (product.imagePaths?.map(p => p.path)) || [product.mainImage, ...(product.galleryImages || [])].filter(Boolean) as string[];

    const handleAddToCart = useCallback(() => {
        setIsAddingToCart(true);
        const selectedAccObjects = accessories.filter((acc) => selectedAccessories.includes(acc.id));
        const selectedSurfaceColorObject = surfaceColors.find((c) => c.id === activeSurfaceColor);
        const selectedEdgeColorObject = edgeColors.find((c) => c.id === activeEdgeColor);
        addItem(product, quantity, selectedSize || undefined, selectedAccObjects, selectedSurfaceColorObject, selectedEdgeColorObject);

        setTimeout(() => {
            setIsAddingToCart(false);
        }, 2000);
    }, [accessories, activeSurfaceColor, activeEdgeColor, addItem, edgeColors, surfaceColors, product, quantity, selectedAccessories, selectedSize]);

    return (
        <main className="min-h-screen bg-transparent text-white selection:bg-primary selection:text-white" dir="rtl">

            <div className="pt-20 md:pt-32">
                <Container className="py-8 md:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            {/* Product Info - Order 1 on desktop (right side) */}
                            <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
                                {/* Header Section */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase tracking-wider border border-accent/30 flex items-center gap-1">
                                            <span className="size-1.5 bg-accent rounded-full animate-pulse"></span>
                                            جديد 2026
                                        </span>
                                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                                            <span className="text-yellow-400 text-xs font-bold">(4.8)</span>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="material-symbols-outlined text-[14px] fill-current text-yellow-400">star</span>
                                            ))}
                                        </div>
                                    </div>

                                    <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                                        {product.name}
                                    </h1>

                                    <p className="text-gray-400 text-base leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Price Section */}
                                <div className="flex flex-col gap-3 p-5 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {hasDiscount && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-black rounded-lg shadow-lg"
                                                >
                                                    وفر {discountPercentageDisplay}٪
                                                </motion.span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {hasDiscount && (
                                                <span className="text-base text-gray-500 line-through">{formatPrice(basePrice)}</span>
                                            )}
                                            <span className="text-3xl font-black text-primary">{formatPrice(finalPrice)}</span>
                                        </div>
                                    </div>

                                    {accessoriesTotal > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="flex flex-col gap-2 pt-3 border-t border-white/10"
                                        >
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-accent font-bold">+{formatPrice(accessoriesTotal)}</span>
                                                <span className="text-gray-400">الملحقات المختارة</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black text-white">{formatPrice(totalPrice)}</span>
                                                <span className="text-sm text-gray-400">الإجمالي النهائي</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {surfaceColors.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                لون السطح <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
                                            </h3>
                                            <span className="text-sm text-gray-400">
                                                {surfaceColors.find((c) => c.id === activeSurfaceColor)?.name}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 flex-wrap justify-start">
                                            {surfaceColors.map((color) => (
                                                <motion.button
                                                    key={color.id}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setActiveSurfaceColor(color.id)}
                                                    className={cn(
                                                        "size-12 rounded-xl border-3 transition-all relative overflow-hidden shadow-lg",
                                                        activeSurfaceColor === color.id
                                                            ? "border-primary ring-4 ring-primary/30 scale-110"
                                                            : "border-white/20 hover:border-white/40"
                                                    )}
                                                    title={color.name}
                                                >
                                                    {color.image ? (
                                                        <div
                                                            className="absolute inset-0 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${getImageUrl(color.image)})` }}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gray-800" />
                                                    )}
                                                    {activeSurfaceColor === color.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <span className="text-white material-symbols-outlined text-[20px] drop-shadow-lg">
                                                                check
                                                            </span>
                                                        </div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {edgeColors.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                لون الأطراف <span className="size-1.5 bg-accent rounded-full animate-pulse"></span>
                                            </h3>
                                            <span className="text-sm text-gray-400">
                                                {edgeColors.find((c) => c.id === activeEdgeColor)?.name}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 flex-wrap justify-start">
                                            {edgeColors.map((color) => (
                                                <motion.button
                                                    key={color.id}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setActiveEdgeColor(color.id)}
                                                    className={cn(
                                                        "size-12 rounded-xl border-3 transition-all relative overflow-hidden shadow-lg",
                                                        activeEdgeColor === color.id
                                                            ? "border-accent ring-4 ring-accent/30 scale-110"
                                                            : "border-white/20 hover:border-white/40"
                                                    )}
                                                    title={color.name}
                                                >
                                                    {color.image ? (
                                                        <div
                                                            className="absolute inset-0 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${getImageUrl(color.image)})` }}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gray-800" />
                                                    )}
                                                    {activeEdgeColor === color.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <span className="text-white material-symbols-outlined text-[20px] drop-shadow-lg">
                                                                check
                                                            </span>
                                                        </div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Size Selection */}
                                {sizes.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-sm font-bold text-white">اختر المقاس</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {sizes.map((size) => (
                                                <motion.button
                                                    key={size.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={cn(
                                                        "p-4 rounded-xl border-2 transition-all text-center",
                                                        selectedSize?.id === size.id
                                                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                                            : "border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10"
                                                    )}
                                                >
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className={cn(
                                                            "text-sm font-bold",
                                                            selectedSize?.id === size.id ? "text-primary" : "text-white"
                                                        )}>
                                                            {size.name}
                                                        </span>
                                                        {size.dimensions && (
                                                            <span className="text-xs text-gray-500">{size.dimensions}</span>
                                                        )}
                                                        <span className="text-primary font-black text-base">{formatPrice(size.price)}</span>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Accessories Section */}
                                {accessories.length > 0 && (
                                    <div className="flex flex-col gap-4 p-5 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full border border-accent/20">
                                                {selectedAccessories.length} محدد
                                            </span>
                                            <h3 className="text-base font-bold text-white">أضف الملحقات</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {accessories.map((accessory) => {
                                                const isSelected = selectedAccessories.includes(accessory.id);
                                                return (
                                                    <motion.label
                                                        key={accessory.id}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                        className={cn(
                                                            "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                                                            isSelected
                                                                ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                                                                : "border-white/10 bg-white/5 hover:border-accent/50"
                                                        )}
                                                    >
                                                        <div className="flex-1 flex items-center gap-3">
                                                            {accessory.image && (
                                                                <div className="size-14 rounded-lg overflow-hidden relative border border-white/10 bg-surface">
                                                                    <Image
                                                                        src={getImageUrl(accessory.image)}
                                                                        alt={accessory.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-white mb-1">{accessory.name}</p>
                                                                <p className="text-accent font-black text-base">+{formatPrice(accessory.price)}</p>
                                                            </div>
                                                        </div>
                                                        <div className={cn(
                                                            "size-6 rounded-md border-2 flex items-center justify-center transition-all",
                                                            isSelected
                                                                ? "bg-accent border-accent"
                                                                : "border-white/30 bg-white/5"
                                                        )}>
                                                            {isSelected && (
                                                                <span className="material-symbols-outlined text-[16px] text-black">check</span>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedAccessories([...selectedAccessories, accessory.id]);
                                                                } else {
                                                                    setSelectedAccessories(selectedAccessories.filter(id => id !== accessory.id));
                                                                }
                                                            }}
                                                            className="sr-only"
                                                        />
                                                    </motion.label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* AR Button */}
                                {(product.model3dPath || product.glbFileUrl) && (
                                    <Link
                                        href={`/ar/${product.slug}`}
                                        className="relative group overflow-hidden rounded-xl"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-secondary opacity-100 group-hover:opacity-80 transition-opacity"></div>
                                        <div className="relative bg-black/40 backdrop-blur-sm hover:bg-black/30 text-white font-bold py-4 px-6 flex items-center justify-center gap-3 transition-all">
                                            <span className="material-symbols-outlined text-accent text-2xl group-hover:scale-110 transition-transform">view_in_ar</span>
                                            <span className="text-lg font-black">جرّب المنتج في غرفتك</span>
                                            <span className="size-2 bg-accent rounded-full animate-pulse"></span>
                                        </div>
                                    </Link>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-6 border-t border-white/10">
                                    <div className="flex gap-3 md:contents order-2 md:order-none">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => toggleFavorite(product)}
                                            className={cn(
                                                "size-14 rounded-xl border flex items-center justify-center transition-all",
                                                isFavorite
                                                    ? "bg-primary/20 text-primary border-primary/50"
                                                    : "bg-white/5 text-gray-400 border-white/10 hover:border-primary/50 hover:text-primary"
                                            )}
                                            title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                                        >
                                            <span className={cn(
                                                "material-symbols-outlined text-[28px] transition-all",
                                                isFavorite && "fill-current"
                                            )}>
                                                favorite
                                            </span>
                                        </motion.button>

                                        <div className="flex-1 md:flex-none flex items-center justify-between bg-white/5 rounded-xl border border-white/10 overflow-hidden min-w-[140px]">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-4 hover:bg-primary/20 transition-colors text-white font-bold text-xl"
                                            >
                                                -
                                            </motion.button>
                                            <span className="px-2 font-bold text-lg text-white">{quantity}</span>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-4 py-4 hover:bg-primary/20 transition-colors text-white font-bold text-xl"
                                            >
                                                +
                                            </motion.button>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
                                        whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                                        onClick={handleAddToCart}
                                        disabled={isAddingToCart || product.stock <= 0}
                                        className={cn(
                                            "flex-1 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg order-1 md:order-none",
                                            product.stock <= 0
                                                ? "bg-gray-600/50 text-gray-400 cursor-not-allowed border border-white/5"
                                                : isAddingToCart
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gradient-to-r from-primary to-primary-dark hover:from-accent hover:to-cyan-600 text-white hover:shadow-2xl hover:shadow-primary/50"
                                        )}
                                    >
                                        {product.stock <= 0 ? (
                                            <>
                                                <span className="material-symbols-outlined text-[24px]">block</span>
                                                <span className="text-base">غير متوفر</span>
                                            </>
                                        ) : isAddingToCart ? (
                                            <>
                                                <span className="material-symbols-outlined text-[24px] animate-bounce">check_circle</span>
                                                <span className="text-base">تمت الإضافة بنجاح!</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                                                <span className="text-base">أضف إلى السلة</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Stock Status */}
                                {product.stock > 0 ? (
                                    <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <span className="size-2 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-green-400 text-xs md:text-sm font-bold"> اصدار حصري  - متبقي {product.stock} قطعة </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                        <span className="size-2 bg-red-400 rounded-full"></span>
                                        <span className="text-red-400 text-xs md:text-sm font-bold">نفذت الكمية - غير متوفر حالياً</span>
                                    </div>
                                )}
                            </div>

                            {/* Image Gallery - Order 2 on desktop (left side) */}
                            <div className="lg:col-span-7 order-1 lg:order-2">
                                <div className="sticky top-24">
                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/10 shadow-2xl">
                                        {/* Decorative gradient */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>

                                        {/* 3D/AR Button */}
                                        {(product.model3dPath || product.glbFileUrl) && (
                                            <Link href={`/ar/${product.slug}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                                    transition={{ duration: 0.6 }}
                                                    className="absolute top-4 left-4 z-20 size-12 rounded-full bg-gradient-to-br from-accent to-cyan-500 backdrop-blur-md border-2 border-white/20 text-white shadow-lg flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined">3d_rotation</span>
                                                </motion.button>
                                            </Link>
                                        )}

                                        {/* Main Image */}
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeImageIndex}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full h-full flex items-center justify-center relative"
                                            >
                                                <Image
                                                    src={getImageUrl(images[activeImageIndex] || "")}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover drop-shadow-2xl"
                                                    priority={activeImageIndex === 0}
                                                />
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Image Navigation Arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-primary transition-all flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined">chevron_left</span>
                                                </button>
                                                <button
                                                    onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-primary transition-all flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined">chevron_right</span>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnail Gallery */}
                                    {images.length > 1 && (
                                        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                                            {images.map((img: string, i: number) => (
                                                <motion.button
                                                    key={i}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setActiveImageIndex(i)}
                                                    className={cn(
                                                        "size-20 rounded-xl overflow-hidden shrink-0 transition-all border-2 relative",
                                                        activeImageIndex === i
                                                            ? "border-primary ring-2 ring-primary/50 shadow-lg"
                                                            : "border-white/10 hover:border-white/30"
                                                    )}
                                                >
                                                    <Image
                                                        src={getImageUrl(img)}
                                                        alt={`view ${i + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </motion.div>
                </Container>
            </div>


            {/* Mobile Sticky Buy Bar */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="glass-aaa border border-primary/30 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                    <div className="flex flex-col gap-0.5 pe-4 border-e border-white/10">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">المجموع</span>
                        <span className="text-lg font-black text-primary whitespace-nowrap">{formatPrice(totalPrice)}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || product.stock <= 0}
                        className={cn(
                            "flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                            product.stock <= 0
                                ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                                : isAddingToCart
                                    ? "bg-green-500 text-white"
                                    : "bg-gradient-to-r from-primary to-primary-dark text-white"
                        )}
                    >
                        {product.stock <= 0 ? (
                            <span className="text-sm">غير متوفر</span>
                        ) : isAddingToCart ? (
                            <span className="material-symbols-outlined text-[20px] animate-bounce">check_circle</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                                <span className="text-sm">أضف للسلة</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}