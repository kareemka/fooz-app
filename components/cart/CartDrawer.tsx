"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/store";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getImageUrl } from "@/lib/products";
import { CURRENCY } from "@/lib/constants";
import Image from "next/image";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-white/5 z-[101] shadow-2xl flex flex-col pt-4"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">shopping_bag</span>
                                <h2 className="text-xl font-black text-white">سلة التسوق ({getItemCount()})</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
                                        <span className="material-symbols-outlined text-[40px]">shopping_bag</span>
                                    </div>
                                    <p className="text-gray-400 text-lg">سلة التسوق فارغة حالياً</p>
                                    <Button onClick={onClose} variant="outline" size="sm">تصفح المتجر</Button>
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <div key={item.cartItemId || `item-${index}`} className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-right">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 shrink-0 relative">
                                                <div className="absolute inset-0">
                                                    <Image
                                                        src={getImageUrl(item.mainImage || "")}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-white font-bold truncate">{item.name}</h3>
                                                    {item.selectedSurfaceColor && (
                                                        <p className="text-gray-400 text-xs flex items-center gap-1.5 justify-end">
                                                            <span className="text-gray-200">{item.selectedSurfaceColor.name}</span>
                                                            <span className="shrink-0">لون السطح:</span>
                                                        </p>
                                                    )}
                                                    {item.selectedEdgeColor && (
                                                        <p className="text-gray-400 text-xs flex items-center gap-1.5 justify-end mt-0.5">
                                                            <span className="text-gray-200">{item.selectedEdgeColor.name}</span>
                                                            <span className="shrink-0">لون الأطراف:</span>
                                                        </p>
                                                    )}
                                                    {item.selectedSize && (
                                                        <p className="text-gray-400 text-xs flex items-center gap-1.5 justify-end mt-0.5">
                                                            <span className="text-gray-200">{item.selectedSize.name}</span>
                                                            <span className="shrink-0">القياس:</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col items-start gap-0.5">
                                                        {(item.discountPercentage && item.discountPercentage > 0) && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-black">
                                                                    %{item.discountPercentage}
                                                                </span>
                                                                <span className="text-gray-500 line-through text-xs font-bold">
                                                                    {Math.round(item.price / (1 - item.discountPercentage / 100)).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <p className="text-primary font-bold">{item.price.toLocaleString()} {CURRENCY.SYMBOL}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center bg-white/5 rounded-lg border border-white/10 overflow-hidden h-8">
                                                            <button
                                                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                                className="px-2 hover:bg-primary/20 transition-colors text-white font-bold"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                                className="px-2 hover:bg-primary/20 transition-colors text-white font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.cartItemId)}
                                                            className="text-red-500/70 hover:text-red-500 p-1 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Display selected accessories */}
                                        {item.selectedAccessories && item.selectedAccessories.length > 0 && (
                                            <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 justify-end">
                                                {item.selectedAccessories.map((acc, accIdx) => (
                                                    <span key={`${item.cartItemId}-${acc.id}-${accIdx}`} className="text-[10px] bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded">
                                                        + {acc.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/5 bg-black/40 space-y-4 pb-10">
                                <div className="flex items-center justify-between text-right text-xl font-bold">
                                    <span className="text-white">{getTotal().toLocaleString()} {CURRENCY.SYMBOL}</span>
                                    <span className="text-gray-400">الإجمالي</span>
                                </div>
                                <p className="text-gray-500 text-xs text-center italic text-pretty">شامل ضريبة القيمة المضافة والشحن</p>
                                <Link href="/checkout" onClick={onClose} className="block">
                                    <Button className="w-full text-lg py-4">إتمام الطلب</Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
