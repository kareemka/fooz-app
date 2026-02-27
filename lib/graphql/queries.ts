import { gql } from "@apollo/client";

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    product(id: $id) {
      id
      slug
      name
      glbFileUrl
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      slug
      name
      description
      price
      discountPercentage
      stock
      mainImage
      galleryImages
      glbFileUrl
      isActive
      category {
        id
        slug
        name
      }
      surfaceColors {
        id
        name
        image
      }
      edgeColors {
        id
        name
        image
      }
      sizes {
        id
        name
        dimensions
        price
      }
      accessories {
        id
        name
        price
        image
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($category: String, $search: String, $skip: Int, $take: Int, $sortBy: ProductSort) {
    products(category: $category, search: $search, skip: $skip, take: $take, sortBy: $sortBy) {
      items {
        id
        slug
        name
        price
        discountPercentage
        mainImage
        description
        stock
        isActive
        category {
          id
          name
          slug
        }
        sizes {
          id
          name
          price
        }
      }
      total
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      items {
        id
        slug
        name
        image
      }
      total
    }
  }
`;

export const GET_ACTIVE_BANNERS = gql`
  query GetActiveBanners {
    activeBanners {
      id
      title
      image
      link
      order
    }
  }
`;
