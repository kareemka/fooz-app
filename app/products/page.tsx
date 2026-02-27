"use client";

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/product/ProductCard";
import { Product, Category } from "@/lib/products";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES, GET_PRODUCTS } from "@/lib/graphql/queries";
import { motion } from "framer-motion";
import Skeleton from "@/components/ui/Skeleton";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ProductsListingContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const activeCategorySlug = searchParams.get("category");
    const searchQuery = searchParams.get("search") || "";

    const { data: categoryData } = useQuery(GET_CATEGORIES);

    useEffect(() => {
        if (categoryData?.categories?.items) {
            setCategories(categoryData.categories.items);
        }
    }, [categoryData]);

    const PAGE_SIZE = 9;

    const { data, loading: isLoading, fetchMore } = useQuery<{ products: { items: Product[], total: number } }>(GET_PRODUCTS, {
        variables: {
            category: activeCategorySlug || undefined,
            search: searchQuery || undefined,
            skip: 0,
            take: PAGE_SIZE
        },
        fetchPolicy: "cache-and-network"
    });

    const products: Product[] = data?.products?.items?.map((p: Product) => ({
        ...p,
        price: p.price || p.sizes?.[0]?.price || 0
    })) || [];
    const total = data?.products?.total || 0;
    const hasMore = products.length < total;

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        try {
            await fetchMore({
                variables: {
                    skip: products.length,
                    take: PAGE_SIZE
                },
            });
        } catch {
            // console.error("Error loading more products:", error);
        }
    }, [isLoading, hasMore, fetchMore, products.length, PAGE_SIZE]);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const target = document.querySelector("#infinite-scroll-trigger");
        if (target) observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [hasMore, isLoading, loadMore]);

    const handleCategoryClick = useCallback((categorySlug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categorySlug) {
            params.set("category", categorySlug);
        } else {
            params.delete("category");
        }
        params.delete("page"); // Infinite scroll doesn't need page param
        router.push(`/products?${params.toString()}`);
    }, [searchParams, router]);

    const handleSearch = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        params.delete("page");
        router.push(`/products?${params.toString()}`);
    }, [searchParams, router]);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            handleSearch(value);
        }, 500);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <main className="min-h-screen bg-transparent relative overflow-hidden">
            <AnimatedBackground />
            <section className="pt-32 md:pt-48 pb-24 relative z-10">
                <Container>
                    {/* Header with search/sort */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6 bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-3xl">
                        <div className="flex items-center gap-4 w-full md:w-auto justify-end md:justify-start order-2 md:order-1">
                            <h1 className="text-xl md:text-2xl font-black text-white text-right">طاولات وكراسي احترافية</h1>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto order-1 md:order-2">
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-3 md:py-2 rounded-xl border border-white/10 w-full sm:w-auto transition-colors focus-within:bg-white/10 focus-within:border-primary/50">
                                <span className="material-symbols-outlined text-gray-500 text-[18px]">search</span>
                                <input
                                    type="text"
                                    placeholder="بحث عن منتج..."
                                    className="bg-transparent border-none focus:outline-none text-right text-sm w-full sm:w-48 md:w-64 text-white placeholder:text-gray-600"
                                    value={searchValue}
                                    onChange={onSearchChange}
                                />
                            </div>
                            <div className="hidden sm:block w-[1px] h-8 bg-white/10" />
                            <div className="flex items-center justify-end gap-2 text-gray-500 text-xs font-bold w-full sm:w-auto">
                                <span className="text-white">الأكثر شعبية</span>
                                <span className="text-[10px] uppercase tracking-widest"> : ترتيب حسب </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">

                        {/* Sidebar Filters */}
                        <aside className="lg:col-span-1 space-y-6 md:space-y-8">

                            {/* Categories Filter */}
                            <div className="glass-aaa border border-white/5 p-4 md:p-8 rounded-2xl md:rounded-[2rem] text-right">
                                <h3 className="hidden md:flex text-white font-black mb-6 items-center justify-end gap-3 translate-x-1">
                                    <span>التصنيفات</span>
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                </h3>
                                <div className="flex flex-row-reverse md:flex-col gap-2 md:space-y-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                    <button
                                        onClick={() => handleCategoryClick(null)}
                                        className={cn(
                                            "flex items-center justify-center md:justify-between group cursor-pointer shrink-0 px-4 py-2 md:px-0 md:py-0 rounded-full md:rounded-none border md:border-none transition-all",
                                            !activeCategorySlug
                                                ? "text-primary border-primary/50 bg-primary/10 md:bg-transparent"
                                                : "text-gray-400 border-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "hidden md:flex w-5 h-5 rounded-lg border items-center justify-center transition-colors",
                                                !activeCategorySlug ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/5'
                                            )}>
                                                <div className={cn("w-2 h-2 bg-primary rounded-sm transition-opacity", !activeCategorySlug ? 'opacity-100' : 'opacity-0')} />
                                            </div>
                                            <span className={cn("text-xs md:text-sm font-bold transition-colors", !activeCategorySlug ? 'text-white' : 'group-hover:text-white')}>الكل</span>
                                        </div>
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryClick(cat.slug)}
                                            className={cn(
                                                "flex items-center justify-center md:justify-between group cursor-pointer shrink-0 px-4 py-2 md:px-0 md:py-0 rounded-full md:rounded-none border md:border-none transition-all",
                                                activeCategorySlug === cat.slug
                                                    ? "text-primary border-primary/50 bg-primary/10 md:bg-transparent"
                                                    : "text-gray-400 border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "hidden md:flex w-5 h-5 rounded-lg border items-center justify-center transition-colors",
                                                    activeCategorySlug === cat.slug ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/5'
                                                )}>
                                                    <div className={cn("w-2 h-2 bg-primary rounded-sm transition-opacity", activeCategorySlug === cat.slug ? 'opacity-100' : 'opacity-0')} />
                                                </div>
                                                <span className={cn("text-xs md:text-sm font-bold transition-colors", activeCategorySlug === cat.slug ? 'text-white' : 'group-hover:text-white')}>{cat.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AR Feature Promo - Hidden on mobile, shown on desktop */}
                            <div className="hidden md:block relative group cursor-pointer overflow-hidden rounded-[2rem] aspect-[4/3]">
                                <Image
                                    src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=400&auto=format&fit=crop"
                                    alt="AR Promo"
                                    fill
                                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                                <div className="absolute inset-0 p-8 flex flex-col justify-end items-end text-right">
                                    <div className="bg-white text-[10px] font-black text-black px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">تجربة الواقع المعزز</div>
                                    <h4 className="text-xl font-black text-white mb-2">شاهد السيت أب في غرفتك</h4>
                                    <p className="text-[10px] font-bold text-white/80 mb-6 uppercase tracking-widest">جرب الآن {'->'}</p>
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="lg:col-span-3">
                            {products.length === 0 && !isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center py-24 text-center glass-aaa rounded-[3rem] border border-white/5"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-primary text-5xl">search_off</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">عذراً، لم نجد ما تبحث عنه</h3>
                                    <p className="text-gray-400 font-bold max-w-sm">جرب استخدام كلمات بحث مختلفة أو تصفح الأقسام الأخرى.</p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map((product: Product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}

                                    {isLoading && (
                                        Array.from({ length: 3 }).map((_, index) => (
                                            <div key={`skeleton-${index}`} className="space-y-4">
                                                <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                                                <Skeleton className="h-6 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Infinite Scroll Trigger */}
                            <div id="infinite-scroll-trigger" className="h-20 w-full flex items-center justify-center mt-12">
                                {hasMore && !isLoading && (
                                    <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                        <span>تحميل المزيد...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

        </main>
    );
};

const ProductsListingPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#08081a] flex items-center justify-center text-white">جاري التحميل...</div>}>
            <ProductsListingContent />
        </Suspense>
    );
};

export default ProductsListingPage;
