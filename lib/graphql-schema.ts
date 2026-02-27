/**
 * GraphQL Schema for Fooz Gaming E-commerce
 */

export const typeDefs = `
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    discountPrice: Float
    category: String
    mainImage: String!
    gallery: [String!]!
    glbFileUrl: String
    colors: [ProductColor!]!
    sizes: [ProductSize!]!
    accessories: [ProductAccessory!]!
    createdAt: String
    updatedAt: String
  }

  type ProductColor {
    id: ID!
    name: String!
    image: String
  }

  type ProductSize {
    id: ID!
    name: String!
    dimensions: String
    price: Float!
  }

  type ProductAccessory {
    id: ID!
    name: String!
    price: Float!
    image: String
  }

  type Query {
    product(id: ID!): Product
    products(category: String, limit: Int): [Product!]!
  }
`;

/**
 * Mock Data following the requirements
 */
const MOCK_PRODUCT = {
  id: "p1",
  name: "Fooz Gaming Desk Pro",
  description: "High-end gaming desk with AR support and RGB integration.",
  category: "Furniture",
  mainImage: "/images/products/desk-main.jpg",
  gallery: [
    "/images/products/desk-1.jpg",
    "/images/products/desk-2.jpg"
  ],
  glbFileUrl: "/models/gaming-desk.glb",
  colors: [
    {
      id: "c1",
      name: "Stealth Black",
      hexCode: "#000000",
      images: ["/images/products/desk-black.jpg"]
    },
    {
      id: "c2",
      name: "Neon Green",
      hexCode: "#39FF14",
      images: ["/images/products/desk-green.jpg"]
    }
  ],
  sizes: [
    {
      id: "s1",
      size_name: "Standard",
      dimensions: "120x60x75",
      price: 250.0
    },
    {
      id: "s2",
      size_name: "Large",
      dimensions: "160x80x75",
      price: 350.0
    }
  ],
  accessories: [
    {
      id: "a1",
      accessory_name: "RGB Strip",
      price: 45.0,
      image: "/images/accessories/rgb.jpg"
    },
    {
      id: "a2",
      accessory_name: "Monitor Mount",
      price: 80.0,
      image: "/images/accessories/mount.jpg"
    }
  ],
  createdAt: "2026-01-29T10:00:00Z",
  updatedAt: "2026-01-29T10:00:00Z"
};

/**
 * Mock Resolvers for testing
 */
export const resolvers = {
  Query: {
    product: () => {
      // Logic to fetch product from DB would go here
      // console.log("Fetching product", id);
      return MOCK_PRODUCT;
    },
    products: () => {
      return [MOCK_PRODUCT];
    }
  }
};
