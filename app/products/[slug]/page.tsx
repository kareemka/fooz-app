import { getClient } from "@/lib/apollo-client";
import { GET_PRODUCT_BY_SLUG } from "@/lib/graphql/queries";
import ProductDetails from "@/components/product/ProductDetails";
import { notFound } from "next/navigation";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { Metadata, ResolvingMetadata } from "next";

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

    // The backend stores image URLs that might be relative or absolute.
    // Ensure you use absolute URLs for Open Graph images.
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fooz-gaming.com";
    const imageUrl = product.mainImage
        ? product.mainImage.startsWith("http")
            ? product.mainImage
            : `${baseUrl}${product.mainImage}`
        : null;

    const images = imageUrl
        ? [
              {
                  url: imageUrl,
                  width: 1200,
                  height: 630,
                  alt: product.name,
              },
              ...previousImages,
          ]
        : previousImages;

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            url: `${baseUrl}/products/${slug}`,
            images,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
            images: imageUrl ? [imageUrl] : [],
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
