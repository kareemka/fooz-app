import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCT_BY_SLUG } from "@/lib/graphql/queries";
import ProductDetails from "@/components/product/ProductDetails";
import { notFound } from "next/navigation";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { Metadata, ResolvingMetadata } from "next";
import { getImageUrl } from "@/lib/products";

// Define the type properly for the params prop
type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;

    const { data } = await getClient().query<{
        productBySlug: {
            name: string;
            description: string;
            mainImage?: string;
        }
    }>({
        query: GET_PRODUCT_BY_SLUG,
        variables: { slug },
    });

    const product = data?.productBySlug;

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    // 1. Get the base URL for the site (Public domain)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fooz-gaming.com";
    
    // 2. Resolve to a Public Absolute URL
    // We want the DIRECT backend link to avoid Next.js image optimization (huge file sizes)
    let finalImageUrl = product.mainImage ? getImageUrl(product.mainImage) : null;
    
    if (finalImageUrl) {
        // If it's a relative path, make it absolute using siteUrl
        if (!finalImageUrl.startsWith("http")) {
            finalImageUrl = `${siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl}${finalImageUrl.startsWith("/") ? "" : "/"}${finalImageUrl}`;
        } 
        // If it's an internal server URL (localhost/127.0.0.1), force it to the public domain
        else if (finalImageUrl.includes("localhost") || finalImageUrl.includes("127.0.0.1")) {
            try {
                const urlObj = new URL(finalImageUrl);
                const baseObj = new URL(siteUrl);
                urlObj.protocol = baseObj.protocol;
                urlObj.host = baseObj.host;
                finalImageUrl = urlObj.toString();
            } catch (e) {
                // Fallback string replacement
                finalImageUrl = finalImageUrl.replace(/http:\/\/localhost(:\d+)?/g, siteUrl)
                                          .replace(/http:\/\/127\.0\.0\.1(:\d+)?/g, siteUrl);
            }
        }
    }

    return {
        title: product.name,
        description: product.description,
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: `/products/${slug}`,
        },
        openGraph: {
            title: product.name,
            description: product.description,
            url: `/products/${slug}`,
            // IMPORTANT: Passing plain string array to avoid Next.js auto-optimization routes
            images: finalImageUrl ? [finalImageUrl] : [],
            type: "website",
            siteName: "Fooz Gaming",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
            images: finalImageUrl ? [finalImageUrl] : [],
        },
        facebook: {
            appId: "123456789", // Placeholder to satisfy debugger warning
        }
    };
}

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
