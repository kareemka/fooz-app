"use client";



import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/queries";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/lib/products";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";

interface FeaturedProductsProps {
    title: string;
    category?: string;
    take?: number;
    sortBy?: string;
}

const FeaturedProducts = ({ title, category, take = 8, sortBy }: FeaturedProductsProps) => {
    const { data, loading: isLoading, error } = useQuery(GET_PRODUCTS, {
        variables: {
            category: category === "all" || !category ? undefined : category,
            take,
            sortBy
        }
    });

    if (error) {
        console.error("FeaturedProducts Query Error:", error);
    }
    if (data) {
        console.log(`FeaturedProducts (${category}, ${sortBy}) loaded:`, data.products?.items?.length);
    }

    const products: Product[] = (data?.products?.items || []).map((p: Product) => ({
        ...p,
        price: p.price || p.sizes?.[0]?.price || 0
    }));

    return (
        <section className="py-8 md:py-12 relative overflow-hidden">
            <Container>
                <div className="flex items-center justify-between mb-8 overflow-hidden">
                    <h2 className="text-xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <span className="w-1.5 md:w-2 h-7 md:h-9 bg-primary rounded-full shadow-glow-sm shadow-primary"></span>
                        {title}
                    </h2>
                    <Link
                        href={category && category !== 'all' ? `/products?category=${category}` : '/products'}
                        className="flex items-center gap-2 group cursor-pointer"
                    >
                        <span className="text-sm font-bold text-white/40 group-hover:text-white transition-colors">عرض الكل</span>
                        <div className="size-9 md:size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 group-hover:border-primary/50 text-white/40 group-hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-[20px] md:text-[22px] rtl:rotate-180 transition-transform group-hover:-translate-x-1">arrow_forward</span>
                        </div>
                    </Link>
                </div>


                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {error && (
                        <div className="col-span-full text-center py-8">
                            <p className="text-red-500 font-bold">Error loading products: {error.message}</p>
                            <pre className="text-xs text-left overflow-auto max-h-40 bg-black/50 p-4 rounded mt-2 text-white">
                                {JSON.stringify(error, null, 2)}
                            </pre>
                        </div>
                    )}

                    {!isLoading && !error && products.length === 0 && (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-400">No products found in this category.</p>
                        </div>
                    )}

                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="space-y-4">
                                <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </Container>
        </section>
    );
};

export default FeaturedProducts;
