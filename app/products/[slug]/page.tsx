import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCT_BY_SLUG } from "@/lib/graphql/queries";
import ProductDetails from "@/components/product/ProductDetails";
import { notFound } from "next/navigation";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

// Define the type properly for the params prop
type Props = {
    params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;

    const { data } = await getClient().query<{
        productBySlug: {
            id: string;
            name: string;
            price: number;
            slug: string;
            description: string;
            mainImage?: string;
            glbFileUrl?: string;
            stock: number;
            isActive: boolean;
            category: {
                id: string;
                name: string;
                slug: string;
                image: string;
            };
            sizes?: { id: string; name: string; price: number; dimensions?: string }[];
        }
    }>({
        query: GET_PRODUCT_BY_SLUG,
        variables: { slug },
    });

    const productData = data?.productBySlug;

    if (!productData) {
        notFound();
    }

    const product = {
        ...productData,
        price: productData.price || productData.sizes?.[0]?.price || 0,
        model3dPath: productData.glbFileUrl || undefined
    };

    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <AnimatedBackground />
            <div className="relative z-10">
                <ProductDetails product={product as any} />
            </div>
        </main>
    );
}
