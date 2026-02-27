import { fetchApi } from "./api";

export interface Category {
    id: string;
    slug: string;
    name: string;
    image: string;
}

export interface ProductColor {
    id: string;
    name: string;
    image?: string;
    hexCode?: string;
}

export interface ProductSize {
    id: string;
    name: string;
    price: number;
    dimensions?: string;
}

export interface ProductAccessory {
    id: string;
    name: string;
    price: number;
    image?: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPercentage?: number; // 0-100
    stock: number;
    isActive: boolean;
    // REST API properties
    imagePaths?: { id: number; path: string }[];
    // GraphQL properties
    slug?: string;
    mainImage?: string;
    galleryImages?: string[];
    // Common
    model3dPath?: string;
    // GraphQL has 'glbFileUrl' instead of model3dPath, let's add it
    glbFileUrl?: string;
    category: Category;
    createdAt?: string;
    surfaceColors?: ProductColor[];
    edgeColors?: ProductColor[];
    sizes?: ProductSize[];
    accessories?: ProductAccessory[];
}

// getCategories removed to avoid RSC import in client components
// Use ApolloWrapper + useQuery in client components
// Use lib/server/products.ts for RSC fetching if needed

// getFilteredProducts removed - using direct GraphQL in components
// export const getFilteredProducts = ...

export const getProductById = async (id: number): Promise<Product | null> => {
    try {
        return await fetchApi(`/products/${id}`);
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};

// Helper for image and model URLs
export const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    // Determine Base URL
    let baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl && process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
        try {
            const url = new URL(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);
            baseUrl = url.origin;
        } catch {
            // Fallback if URL parsing fails
        }
    }

    if (!baseUrl) {
        baseUrl = "http://localhost:3001";
    }

    // Clean slashes
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${cleanBase}${cleanPath}`;
};
