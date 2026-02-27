"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/products";

interface WishlistStore {
    items: Product[];
    toggleFavorite: (product: Product) => void;
    isFavorite: (productId: string) => boolean;
    clearWishlist: () => void;
    getItemCount: () => number;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            toggleFavorite: (product) => {
                const items = get().items;
                const isExisting = items.some(item => item.id === product.id);

                if (isExisting) {
                    set({ items: items.filter(item => item.id !== product.id) });
                } else {
                    set({ items: [...items, product] });
                }
            },
            isFavorite: (productId) => {
                return get().items.some(item => item.id === productId);
            },
            clearWishlist: () => set({ items: [] }),
            getItemCount: () => get().items.length,
        }),
        {
            name: "fooz-wishlist",
        }
    )
);
