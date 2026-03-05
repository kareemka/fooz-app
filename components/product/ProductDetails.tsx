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
import dynamic from "next/dynamic";

interface ProductDetailsProps {
    product: Product;
}

// ─── Lazy 3D Viewer ───────────────────────────────────────────────────────────
const Model3DViewer = dynamic(() => import("@/components/product/Model3DViewer"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/50">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-sm font-medium">جاري تحميل النموذج ثلاثي الأبعاد…</span>
        </div>
    ),
});

// ─── 3D Dialog ────────────────────────────────────────────────────────────────
function Model3DDialog({
    open,
    onClose,
    glbUrl,
    productName,
}: {
    open: boolean;
    onClose: () => void;
    glbUrl: string;
    productName: string;
}) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        key="dialog"
                        initial={{ opacity: 0, scale: 0.93, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 20 }}
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                        className="fixed inset-4 top-[120px] md:top-[110px] lg:top-[150px] md:inset-8 lg:inset-x-16 lg:bottom-16 z-[110] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-950"
                    >

                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-accent/10 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[20px]">view_in_ar</span>
                                </div>
                                <div>
                                    <p className="font-black text-white text-sm leading-tight">{productName}</p>
                                    <p className="text-xs text-gray-400">عرض ثلاثي الأبعاد · اسحب للتدوير</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <div className="flex-1 relative min-h-0">
                            <Model3DViewer glbUrl={glbUrl} />
                        </div>
                        <div className="px-5 py-3 border-t border-white/10 bg-black/20 flex-shrink-0">
                            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[14px]">touch_app</span>
                                    اسحب للتدوير
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[14px]">pinch</span>
                                    قرص للتكبير
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[14px]">pan_tool</span>
                                    انقر مرتين للتمركز
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetails({ product }: ProductDetailsProps) {
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [show3D, setShow3D] = useState(false);

    const { addItem } = useCart();
    const { toggleFavorite, isFavorite: checkFavorite } = useWishlist();
    const isFavorite = checkFavorite(product.id);

    const surfaceColors = useMemo(() => product.surfaceColors || [], [product.surfaceColors]);
    const edgeColors = useMemo(() => product.edgeColors || [], [product.edgeColors]);
    const sizes = useMemo(() => product.sizes || [], [product.sizes]);
    const accessories = useMemo(() => product.accessories || [], [product.accessories]);

    const [activeSurfaceColor, setActiveSurfaceColor] = useState<string | null>(
        surfaceColors.length > 0 ? surfaceColors[0]?.id : null
    );
    const [activeEdgeColor, setActiveEdgeColor] = useState<string | null>(
        edgeColors.length > 0 ? edgeColors[0]?.id : null
    );
    const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[0] : null);
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

    const hasDiscount = !!(product.discountPercentage && product.discountPercentage > 0);

    const basePrice = useMemo(() => {
        if (sizes.length > 0) return selectedSize?.price || product.price || 0;
        return product.price || 0;
    }, [sizes, selectedSize, product.price]);

    const finalPrice = useMemo(() => {
        return hasDiscount ? basePrice * (1 - product.discountPercentage! / 100) : basePrice;
    }, [hasDiscount, basePrice, product.discountPercentage]);

    const accessoriesTotal = useMemo(
        () => accessories.filter((a) => selectedAccessories.includes(a.id)).reduce((s, a) => s + a.price, 0),
        [accessories, selectedAccessories]
    );

    const totalPrice = finalPrice + accessoriesTotal;
    const discountDisplay = hasDiscount ? product.discountPercentage! : 0;

    const images = useMemo(() => {
        const paths = product.imagePaths?.map((p) => p.path);
        if (paths && paths.length > 0) return paths;
        return [product.mainImage, ...(product.galleryImages || [])].filter(Boolean) as string[];
    }, [product.imagePaths, product.mainImage, product.galleryImages]);

    const has3D = !!(product.model3dPath || product.glbFileUrl);
    const glbUrl = getImageUrl(product.glbFileUrl || product.model3dPath || "");

    const handleAddToCart = useCallback(() => {
        setIsAddingToCart(true);
        const selectedAccObjects = accessories.filter((a) => selectedAccessories.includes(a.id));
        const selectedSurfaceColorObject = surfaceColors.find((c) => c.id === activeSurfaceColor);
        const selectedEdgeColorObject = edgeColors.find((c) => c.id === activeEdgeColor);
        addItem(product, quantity, selectedSize || undefined, selectedAccObjects, selectedSurfaceColorObject, selectedEdgeColorObject);
        setTimeout(() => setIsAddingToCart(false), 2000);
    }, [accessories, activeSurfaceColor, activeEdgeColor, addItem, edgeColors, surfaceColors, product, quantity, selectedAccessories, selectedSize]);

    const prevImage = () => setActiveImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));
    const nextImage = () => setActiveImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

    return (
        <main className="min-h-screen bg-transparent text-white selection:bg-primary selection:text-white" dir="rtl">

            {has3D && (
                <Model3DDialog
                    open={show3D}
                    onClose={() => setShow3D(false)}
                    glbUrl={glbUrl}
                    productName={product.name}
                />
            )}

            <div className="pt-20 md:pt-32">
                <Container className="py-8 md:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                            {/* ═══ Left: Product Info ══════════════════════════ */}
                            <div className="lg:col-span-5 flex flex-col gap-5 order-2 lg:order-1">

                                {/* Header */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase tracking-wider border border-accent/30 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                            جديد 2026
                                        </span>
                                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="material-symbols-outlined text-[13px] fill-current text-yellow-400">star</span>
                                            ))}
                                            <span className="text-yellow-400 text-xs font-bold mr-1">(4.8)</span>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                                        {product.name}
                                    </h1>
                                    <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
                                </div>

                                {/* Price */}
                                <div className="p-5 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {hasDiscount && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="inline-block px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-black rounded-lg shadow-lg"
                                                >
                                                    وفّر {discountDisplay}٪
                                                </motion.span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {hasDiscount && (
                                                <span className="text-sm text-gray-500 line-through">{formatPrice(basePrice)}</span>
                                            )}
                                            <span className="text-3xl font-black text-primary">{formatPrice(finalPrice)}</span>
                                        </div>
                                    </div>

                                    {accessoriesTotal > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="flex flex-col gap-2 pt-3 mt-3 border-t border-white/10"
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

                                {/* Surface Colors */}
                                {surfaceColors.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                لون السطح <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                            </h3>
                                            <span className="text-sm text-primary font-semibold">
                                                {surfaceColors.find((c) => c.id === activeSurfaceColor)?.name}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 flex-wrap">
                                            {surfaceColors.map((color) => (
                                                <motion.button
                                                    key={color.id}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setActiveSurfaceColor(color.id)}
                                                    className={cn(
                                                        "w-12 h-12 rounded-xl transition-all relative overflow-hidden shadow-lg border-2",
                                                        activeSurfaceColor === color.id
                                                            ? "border-primary ring-4 ring-primary/30 scale-110"
                                                            : "border-white/20 hover:border-white/40"
                                                    )}
                                                    title={color.name}
                                                >
                                                    {color.image ? (
                                                        <div className="absolute inset-0 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${getImageUrl(color.image)})` }} />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gray-800" />
                                                    )}
                                                    {activeSurfaceColor === color.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <span className="material-symbols-outlined text-[18px] text-white drop-shadow-lg">check</span>
                                                        </div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Edge Colors */}
                                {edgeColors.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                                لون الأطراف <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                            </h3>
                                            <span className="text-sm text-accent font-semibold">
                                                {edgeColors.find((c) => c.id === activeEdgeColor)?.name}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 flex-wrap">
                                            {edgeColors.map((color) => (
                                                <motion.button
                                                    key={color.id}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setActiveEdgeColor(color.id)}
                                                    className={cn(
                                                        "w-12 h-12 rounded-xl transition-all relative overflow-hidden shadow-lg border-2",
                                                        activeEdgeColor === color.id
                                                            ? "border-accent ring-4 ring-accent/30 scale-110"
                                                            : "border-white/20 hover:border-white/40"
                                                    )}
                                                    title={color.name}
                                                >
                                                    {color.image ? (
                                                        <div className="absolute inset-0 bg-cover bg-center"
                                                            style={{ backgroundImage: `url(${getImageUrl(color.image)})` }} />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gray-800" />
                                                    )}
                                                    {activeEdgeColor === color.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <span className="material-symbols-outlined text-[18px] text-white drop-shadow-lg">check</span>
                                                        </div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {sizes.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">اختر المقاس</h3>
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
                                                        <span className={cn("text-sm font-bold", selectedSize?.id === size.id ? "text-primary" : "text-white")}>
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

                                {/* Accessories */}
                                {accessories.length > 0 && (
                                    <div className="p-5 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full border border-accent/20">
                                                {selectedAccessories.length} محدد
                                            </span>
                                            <h3 className="text-base font-bold text-white">أضف الملحقات</h3>
                                        </div>
                                        <div className="flex flex-col gap-3">
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
                                                                ? "border-accent bg-accent/10"
                                                                : "border-white/10 bg-white/5 hover:border-accent/50"
                                                        )}
                                                    >
                                                        {accessory.image && (
                                                            <div className="w-14 h-14 rounded-lg overflow-hidden relative border border-white/10 flex-shrink-0">
                                                                <Image src={getImageUrl(accessory.image)} alt={accessory.name} fill className="object-cover" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-white mb-1">{accessory.name}</p>
                                                            <p className="text-accent font-black">+{formatPrice(accessory.price)}</p>
                                                        </div>
                                                        <div className={cn(
                                                            "w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                                            isSelected ? "bg-accent border-accent" : "border-white/30 bg-white/5"
                                                        )}>
                                                            {isSelected && <span className="material-symbols-outlined text-[16px] text-black">check</span>}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedAccessories((prev) => [...prev, accessory.id]);
                                                                } else {
                                                                    setSelectedAccessories((prev) => prev.filter((id) => id !== accessory.id));
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

                                {/* Action Buttons */}
                                <div className="flex flex-col md:flex-row gap-3 pt-5 border-t border-white/10">
                                    <div className="flex gap-3 md:contents order-2 md:order-none">
                                        {/* Favourite */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleFavorite(product)}
                                            className={cn(
                                                "w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0",
                                                isFavorite
                                                    ? "bg-primary/20 text-primary border-primary/50"
                                                    : "bg-white/5 text-gray-400 border-white/10 hover:border-primary/50 hover:text-primary"
                                            )}
                                            title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                                        >
                                            <span className={cn("material-symbols-outlined text-[26px]", isFavorite && "fill-current")}>
                                                favorite
                                            </span>
                                        </motion.button>

                                        {/* Quantity */}
                                        <div className="flex-1 md:flex-none flex items-center justify-between bg-white/5 rounded-xl border border-white/10 overflow-hidden min-w-[140px]">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-4 hover:bg-primary/20 transition-colors text-white font-bold text-xl"
                                            >-</motion.button>
                                            <span className="px-2 font-bold text-lg text-white">{quantity}</span>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-4 py-4 hover:bg-primary/20 transition-colors text-white font-bold text-xl"
                                            >+</motion.button>
                                        </div>
                                    </div>

                                    {/* Add to Cart */}
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
                                                <span className="material-symbols-outlined text-[22px]">block</span>
                                                <span>غير متوفر</span>
                                            </>
                                        ) : isAddingToCart ? (
                                            <>
                                                <span className="material-symbols-outlined text-[22px] animate-bounce">check_circle</span>
                                                <span>تمت الإضافة!</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                                                <span>أضف إلى السلة</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Stock Badge */}
                                {product.stock > 0 ? (
                                    <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-green-400 text-xs md:text-sm font-bold">
                                            إصدار حصري · متبقي {product.stock} قطعة
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                        <span className="w-2 h-2 bg-red-400 rounded-full" />
                                        <span className="text-red-400 text-xs md:text-sm font-bold">نفذت الكمية · غير متوفر حالياً</span>
                                    </div>
                                )}
                            </div>

                            {/* ═══ Right: Image Gallery ════════════════════════ */}
                            <div className="lg:col-span-7 order-1 lg:order-2">
                                <div className="sticky top-24 flex flex-col gap-4">

                                    {/* Main image */}
                                    <div
                                        className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/10 shadow-2xl"
                                        style={{ aspectRatio: "4 / 3" }}
                                    >
                                        {/* Decoration */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none z-10" />

                                        {/* Counter */}
                                        {images.length > 1 && (
                                            <div className="absolute top-4 right-4 z-20 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-white font-bold">
                                                {activeImageIndex + 1} / {images.length}
                                            </div>
                                        )}

                                        {/* Image */}
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeImageIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute inset-0 flex items-center justify-center p-6"
                                            >
                                                {images[activeImageIndex] && (
                                                    <Image
                                                        src={getImageUrl(images[activeImageIndex])}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain drop-shadow-2xl"
                                                        priority={activeImageIndex === 0}
                                                    />
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-primary/80 hover:border-primary transition-all flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined">chevron_left</span>
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-primary/80 hover:border-primary transition-all flex items-center justify-center"
                                                >
                                                    <span className="material-symbols-outlined">chevron_right</span>
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* ── Gallery & Interaction Tools ─────────────────────────── */}
                                    <div className="flex flex-col gap-6 mt-6">

                                        {/* Thumbnails Grid */}
                                        {images.length > 1 && (
                                            <div className="flex flex-wrap gap-2.5">
                                                {images.map((img: string, i: number) => (
                                                    <motion.button
                                                        key={i}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setActiveImageIndex(i)}
                                                        className={cn(
                                                            "w-20 h-20 rounded-xl overflow-hidden transition-all border-2 relative bg-gray-900 flex-shrink-0",
                                                            activeImageIndex === i
                                                                ? "border-primary ring-2 ring-primary/50 shadow-lg"
                                                                : "border-white/10 hover:border-white/30"
                                                        )}
                                                    >
                                                        <Image
                                                            src={getImageUrl(img)}
                                                            alt={`صورة ${i + 1}`}
                                                            fill
                                                            className="object-contain p-1"
                                                        />
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Interactive Tools Section */}
                                        {has3D && (
                                            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                                                        <span className="w-1 h-1 bg-accent rounded-full animate-ping" />
                                                        استعراض الموديلات
                                                    </h4>
                                                </div>

                                                <div className="flex gap-3">
                                                    {/* 3D View Button */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setShow3D(true)}
                                                        className="group relative flex items-center justify-center sm:justify-start gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 px-4 sm:px-5 py-3 rounded-xl transition-all sm:min-w-[140px]"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary group-hover:to-accent transition-all">
                                                            <span className="material-symbols-outlined text-[20px] text-primary group-hover:text-white">view_in_ar</span>
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-[10px] text-gray-500 font-bold leading-none mb-1">تفاعلي</span>
                                                            <span className="text-sm font-black text-white leading-none">عرض 3D</span>
                                                        </div>
                                                    </motion.button>

                                                    {/* AR View Button */}
                                                    <Link href={`/ar/${product.slug}`}>
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="group relative flex items-center justify-center sm:justify-start gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 px-4 sm:px-5 py-3 rounded-xl transition-all w-full sm:min-w-[140px] cursor-pointer"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-violet-500 group-hover:to-pink-500 transition-all">
                                                                <span className="material-symbols-outlined text-[20px] text-violet-400 group-hover:text-white">phone_iphone</span>
                                                            </div>
                                                            <div className="flex flex-col items-start">
                                                                <span className="text-[10px] text-gray-500 font-bold leading-none mb-1">واقع معزز</span>
                                                                <span className="text-sm font-black text-white leading-none">تجربة AR</span>
                                                            </div>
                                                        </motion.div>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                        </section>
                    </motion.div>
                </Container>
            </div>

            {/* ── Mobile Sticky Buy Bar ─────────────────────────────── */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                <div className="glass-aaa border border-primary/30 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
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
                                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                                <span className="text-sm">أضف للسلة</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}