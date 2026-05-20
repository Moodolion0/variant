import { config } from '../config';

const API_URL = config.API_BASE_URL;

interface LoginResponse {
  token: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  async logout(token: string): Promise<void> {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to get profile");
    }

    return data;
  },
};

export const supplierService = {
  async getProducts(token: string) {
    const response = await fetch(`${API_URL}/supplier/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data;
  },

  async createProduct(token: string, data: any) {
    if (!token) {
      throw new Error("Token is required");
    }
    
    console.log("Creating product with token:", token ? "present" : "missing");
    const response = await fetch(`${API_URL}/supplier/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Create product error:", { status: response.status, ...responseData });
      throw new Error(responseData.message || `Failed to create product (${response.status})`);
    }

    return responseData;
  },

  async updateProduct(token: string, id: number, data: any) {
    const response = await fetch(`${API_URL}/supplier/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update product");
    }

    return responseData;
  },

  async deleteProduct(token: string, id: number) {
    const response = await fetch(`${API_URL}/supplier/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to delete product");
    }

    return responseData;
  },

  async updateStock(token: string, id: number, stockQuantity: number) {
    const response = await fetch(`${API_URL}/supplier/products/${id}/stock`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ stock_quantity: stockQuantity }),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update stock");
    }

    return responseData;
  },

  async uploadImage(token: string, productId: number, file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${API_URL}/supplier/products/${productId}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to upload image");
    }

    return data.data;
  },

  async getImages(token: string, productId: number) {
    const response = await fetch(
      `${API_URL}/supplier/products/${productId}/images`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch images");
    }

    return data.data ?? [];
  },

  async deleteImage(token: string, imageId: number) {
    const response = await fetch(
      `${API_URL}/supplier/products/images/${imageId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete image");
    }

    return data.success;
  },
};

export const orderService = {
  async getSupplierOrders(token: string) {
    const response = await fetch(`${API_URL}/supplier/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    return data;
  },
};

export default {
  auth: authService,
  supplier: supplierService,
  orders: orderService,
};
