import { Product, CreateProductDto } from "./types";

const API_BASE_URL = "http://localhost:3001";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return undefined as T;
  }

  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products");
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: CreateProductDto): Promise<Product> {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  async updateProduct(
    id: number,
    product: Partial<CreateProductDto>
  ): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiClient();