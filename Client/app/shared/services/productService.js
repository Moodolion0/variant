const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Transform API product to app product format
 */
function transformProduct(apiProduct) {
  // Get first image URL from images array
  let imageUrl = null;
  if (apiProduct.images && apiProduct.images.length > 0) {
    imageUrl = apiProduct.images[0].file_url;
  }
  
  return {
    id: String(apiProduct.id),
    title: apiProduct.name,
    price: `${apiProduct.price} €`,
    priceNumber: Number(apiProduct.price),
    currency: "€",
    image: imageUrl,
    category: apiProduct.keywords || "General",
    description: apiProduct.description || "",
    stock: apiProduct.stock_quantity || 0,
  };
}

export const productService = {
  /**
   * Get all products
   */
  async getProducts() {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      
      // Handle different API response formats
      if (data.data) {
        return data.data.map(transformProduct);
      }
      if (Array.isArray(data)) {
        return data.map(transformProduct);
      }
      return [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id) {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      
      if (data.data) {
        return transformProduct(data.data);
      }
      return transformProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  /**
   * Search products
   */
  async searchProducts(query) {
    try {
      const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      const data = await response.json();
      
      if (data.data) {
        return data.data.map(transformProduct);
      }
      if (Array.isArray(data)) {
        return data.map(transformProduct);
      }
      return [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },
};

export default productService;
