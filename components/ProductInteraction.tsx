"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Product, ProductColor, ProductSize, ProductAccessory } from "@/lib/products";

interface ProductInteractionProps {
    product: Product;
}

const DynamicModelViewer = dynamic(() => import("./product/ModelViewer"), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">جاري تحميل العرض ثلاثي الأبعاد...</div>
});

export default function ProductInteraction({ product }: ProductInteractionProps) {
    const [selectedColor, setSelectedColor] = useState<ProductColor | undefined>(product.surfaceColors?.[0]);
    const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(product.sizes?.[0]);
    const [selectedAccessories, setSelectedAccessories] = useState<ProductAccessory[]>([]);

    // Pricing Logic: Final Price = ProductSize.price + SUM(SelectedAccessories.price)
    const calculateTotal = () => {
        const sizePrice = selectedSize?.price || 0;
        const itemsPrice = selectedAccessories.reduce((sum, acc) => sum + acc.price, 0);
        return sizePrice + itemsPrice;
    };

    const toggleAccessory = (accessory: ProductAccessory) => {
        if (selectedAccessories.find((a) => a.id === accessory.id)) {
            setSelectedAccessories(selectedAccessories.filter((a) => a.id !== accessory.id));
        } else {
            setSelectedAccessories([...selectedAccessories, accessory]);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 text-white bg-black min-h-screen">
            {/* --- 3D / AR Viewer Section --- */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <DynamicModelViewer
                    src={product.glbFileUrl || ""}
                    poster={product.mainImage || ""}
                    alt={product.name}
                />
            </div>

            {/* --- Product Info & Configurator Section --- */}
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tighter mb-2">{product.name}</h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">{product.description}</p>
                </div>

                {/* Color Selection */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-500">Pick a Color</h3>
                    <div className="flex gap-4">
                        {product.surfaceColors?.map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setSelectedColor(color)}
                                className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor?.id === color.id ? "border-orange-500 scale-110" : "border-transparent"
                                    }`}
                                style={{ backgroundColor: color.hexCode || '#000' }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Size Selection */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-500">Select Size</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes?.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => setSelectedSize(size)}
                                className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${selectedSize?.id === size.id
                                    ? "bg-orange-500 border-orange-500 text-black"
                                    : "bg-zinc-900 border-zinc-800 text-white hover:border-zinc-600"
                                    }`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Accessories Selection */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-500">Add-ons</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {product.accessories?.map((acc) => (
                            <div
                                key={acc.id}
                                onClick={() => toggleAccessory(acc)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAccessories.find((a) => a.id === acc.id)
                                    ? "bg-orange-500/10 border-orange-500"
                                    : "bg-zinc-900 border-zinc-800"
                                    }`}
                            >
                                <p className="font-bold">{acc.name}</p>
                                <p className="text-orange-500 font-bold">+ ${acc.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Checkout Summary */}
                <div className="mt-auto border-t border-zinc-800 pt-8 flex items-center justify-between">
                    <div>
                        <p className="text-zinc-500 text-sm uppercase font-bold">Total Price</p>
                        <p className="text-4xl font-black text-white">${calculateTotal()}</p>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-black px-12 py-5 rounded-2xl font-black text-xl transition-transform active:scale-95 shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                        ORDER NOW
                    </button>
                </div>
            </div>
        </div>
    );
}
