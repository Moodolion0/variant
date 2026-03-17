const API_URL = "http://localhost:8000/api";

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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
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

    if (!response.ok) {
      throw new Error("Failed to get profile");
    }

    return response.json();
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

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  },

  async createProduct(token: string, data: any) {
    console.log("Creating product with token:", token);
    const response = await fetch(`${API_URL}/supplier/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Create product error:", errorData);
      throw new Error(errorData.message || "Failed to create product");
    }

    return response.json();
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

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return response.json();
  },

  async deleteProduct(token: string, id: number) {
    const response = await fetch(`${API_URL}/supplier/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return response.json();
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

    if (!response.ok) {
      throw new Error("Failed to update stock");
    }

    return response.json();
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

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json();
  },
};

export default {
  auth: authService,
  supplier: supplierService,
  orders: orderService,
};
