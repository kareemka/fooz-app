"use client";

import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "@/lib/graphql/queries";
import Container from "@/components/ui/Container";
import Link from "next/link";
import { Category, getImageUrl } from "@/lib/products";
import Skeleton from "@/components/ui/Skeleton";
import Image from "next/image";
import { useRef, useState, useEffect, JSX, useCallback } from "react";
import { cn } from "@/lib/utils";
import React from "react";
import styles from "./Categories.module.css";

const Categories = () => {
    const { data, loading: isLoading } = useQuery<{ categories: { items: Category[] } }>(GET_CATEGORIES);
    const categories: Category[] = data?.categories?.items || [];
    const [activeIndex, setActiveIndex] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const allCardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const modIndex = useCallback((i: number) => {
        const baseCount = categories.length;
        if (baseCount === 0) return 0;
        return ((i % baseCount) + baseCount) % baseCount;
    }, [categories.length]);

    const scrollToCard = useCallback((index: number, behavior: ScrollBehavior = 'auto') => {
        const card = allCardsRef.current[index];
        const track = trackRef.current;
        if (!card || !track) return;

        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const offset = cardRect.left - (trackRect.left + trackRect.width / 2 - cardRect.width / 2);

        track.scrollBy({
            left: offset,
            behavior: behavior,
        });
    }, []);

    const updateActiveCard = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;

        let closestIndex = -1;
        let closestDistance = Infinity;

        allCardsRef.current.forEach((card, index) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distance = Math.abs(cardCenter - centerX);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        const baseIndex = modIndex(closestIndex);
        setActiveIndex(baseIndex);
    }, [modIndex]);

    useEffect(() => {
        if (!trackRef.current || categories.length === 0) return;

        const track = trackRef.current;
        const baseCount = categories.length;

        // Scroll to initial position (middle set of duplicates)
        const initialIndex = baseCount * 2;

        requestAnimationFrame(() => {
            scrollToCard(initialIndex, 'auto');
            updateActiveCard();
        });

        // Scroll event listener
        let scrolling = false;
        const handleScroll = () => {
            if (!scrolling) {
                requestAnimationFrame(() => {
                    updateActiveCard();
                    scrolling = false;
                });
                scrolling = true;
            }
        };

        track.addEventListener('scroll', handleScroll);
        return () => track.removeEventListener('scroll', handleScroll);
    }, [categories.length, updateActiveCard, scrollToCard]);

    const handleCardClick = (index: number, slug: string, e: React.MouseEvent) => {
        const baseIndex = modIndex(index);

        if (baseIndex !== activeIndex) {
            e.preventDefault();
            scrollToCard(index, 'smooth');
        }
    };

    const handleDotClick = (baseIndex: number) => {
        const baseCount = categories.length;
        const targetIndex = baseCount * 2 + baseIndex;
        scrollToCard(targetIndex, 'smooth');
    };

    // Create infinite scroll: 2 sets before + original + 2 sets after
    const createInfiniteCards = () => {
        const cards: JSX.Element[] = [];
        let globalIdx = 0;

        // 2 sets before (reversed)
        for (let set = 0; set < 2; set++) {
            for (let i = categories.length - 1; i >= 0; i--) {
                const cat = categories[i];
                const currentGlobalIdx = globalIdx;
                cards.push(
                    <CategoryCard
                        key={`before-${set}-${cat.id}-${currentGlobalIdx}`}
                        category={cat}
                        index={currentGlobalIdx}
                        isActive={modIndex(currentGlobalIdx) === activeIndex}
                        onCardClick={handleCardClick}
                        ref={(el) => {
                            allCardsRef.current[currentGlobalIdx] = el;
                        }}
                    />
                );
                globalIdx++;
            }
        }

        // Original set
        categories.forEach((cat) => {
            const currentGlobalIdx = globalIdx;
            cards.push(
                <CategoryCard
                    key={`original-${cat.id}-${currentGlobalIdx}`}
                    category={cat}
                    index={currentGlobalIdx}
                    isActive={modIndex(currentGlobalIdx) === activeIndex}
                    onCardClick={handleCardClick}
                    ref={(el) => {
                        allCardsRef.current[currentGlobalIdx] = el;
                    }}
                />
            );
            globalIdx++;
        });

        // 2 sets after
        for (let set = 0; set < 2; set++) {
            categories.forEach((cat) => {
                const currentGlobalIdx = globalIdx;
                cards.push(
                    <CategoryCard
                        key={`after-${set}-${cat.id}-${currentGlobalIdx}`}
                        category={cat}
                        index={currentGlobalIdx}
                        isActive={modIndex(currentGlobalIdx) === activeIndex}
                        onCardClick={handleCardClick}
                        ref={(el) => {
                            allCardsRef.current[currentGlobalIdx] = el;
                        }}
                    />
                );
                globalIdx++;
            });
        }

        return cards;
    };

    return (
        <section className={styles.categorySlider}>
            <Container>
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-5xl font-black text-white flex items-center gap-4">
                        <span className="w-2.5 h-10 bg-[#B026FF] rounded-full shadow-[0_0_20px_rgba(176,38,255,0.5)]"></span>
                        تصفح  قوائم المنتجات
                    </h2>
                    <Link
                        href="/products"
                        className="text-sm md:text-base font-bold text-gray-400 hover:text-[#B026FF] transition-all flex items-center gap-2 group"
                    >
                        عرض الكل
                        <span className="material-symbols-outlined text-xl group-hover:translate-x-[-6px] transition-transform">
                            arrow_back
                        </span>
                    </Link>
                </div>

                <div className={styles.catContainer}>
                    {isLoading ? (
                        <div className="flex gap-5 justify-center px-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex-shrink-0 w-[180px] md:w-[220px] flex flex-col items-center gap-4">
                                    <Skeleton className="w-full aspect-square rounded-full" />
                                    <Skeleton className="h-6 w-32 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div
                                ref={trackRef}
                                className={styles.catTrack}
                                dir="rtl"
                            >
                                {createInfiniteCards()}
                            </div>

                            {/* Indicators */}
                            <div className={styles.catIndicators}>
                                {categories.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={cn(styles.dot, activeIndex === idx && styles.isActive)}
                                        onClick={() => handleDotClick(idx)}
                                        aria-label={`Go to category ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </Container>
        </section>
    );
};

// Category Card Component
interface CategoryCardProps {
    category: Category;
    index: number;
    isActive: boolean;
    onCardClick: (index: number, slug: string, e: React.MouseEvent) => void;
}

const CategoryCard = React.forwardRef<HTMLDivElement, CategoryCardProps>(
    ({ category, index, isActive, onCardClick }, ref) => {
        return (
            <div
                ref={ref}
                className={styles.catCard}
            >
                <Link
                    href={`/products?category=${category.slug}`}
                    onClick={(e) => onCardClick(index, category.slug, e)}
                    className={styles.cardLink}
                >
                    <div className={cn(styles.catInner, isActive && styles.isActive)}>
                        <div className={styles.catGlow} />

                        <div className={styles.catImgWrap}>
                            <Image
                                src={getImageUrl(category.image)}
                                alt={category.name}
                                width={160}
                                height={160}
                                className={styles.catImg}
                                draggable={false}
                            />
                        </div>

                        <div className={styles.catLabel}>{category.name}</div>
                    </div>
                </Link>
            </div>
        );
    }
);

CategoryCard.displayName = 'CategoryCard';

export default Categories;