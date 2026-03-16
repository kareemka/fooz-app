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
        return { title: "Product Not Found" };
    }

    // Get the public-facing site URL
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://fooz-gaming.com").replace(/\/$/, "");

    // Resolve the image to a DIRECT public URL (no Next.js optimization proxy)
    let finalImageUrl: string | null = product.mainImage ? getImageUrl(product.mainImage) : null;
    if (finalImageUrl) {
        if (!finalImageUrl.startsWith("http")) {
            // Relative path → make absolute
            finalImageUrl = `${siteUrl}${finalImageUrl.startsWith("/") ? "" : "/"}${finalImageUrl}`;
        } else if (/localhost|127\.0\.0\.1/.test(finalImageUrl)) {
            // Internal server URL → swap to public domain
            try {
                const u = new URL(finalImageUrl);
                const b = new URL(siteUrl);
                u.protocol = b.protocol;
                u.host = b.host;
                finalImageUrl = u.toString();
            } catch {
                finalImageUrl = finalImageUrl
                    .replace(/http:\/\/localhost(:\d+)?/g, siteUrl)
                    .replace(/http:\/\/127\.0\.0\.1(:\d+)?/g, siteUrl);
            }
        }
    }

    // Build the image object list (no metadataBase → Next.js will NOT proxy through /_next/image)
    const ogImages = finalImageUrl
        ? [{ url: finalImageUrl, width: 1200, height: 630, alt: product.name }]
        : [];

    return {
        title: product.name,
        description: product.description,
        // NOTE: intentionally NO metadataBase here – adding it causes Next.js to proxy
        // the og:image through /_next/image?w=3840 which WhatsApp / Instagram reject.
        alternates: {
            canonical: `${siteUrl}/products/${slug}`,
        },
        openGraph: {
            title: product.name,
            description: product.description,
            url: `${siteUrl}/products/${slug}`,
            images: ogImages,
            type: "website",
            siteName: "Fooz Gaming",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
            images: finalImageUrl ? [finalImageUrl] : [],
        },
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
