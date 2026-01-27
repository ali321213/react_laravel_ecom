// Service functions for product-related API calls.
// These are used by Redux thunks and can also be reused directly if needed.

import api from "../lib/axios";
import type { PaginatedResponse, Product, ProductForm, ProductFilters } from "../types/product";

// Fetch a list of products for the admin (with optional filters like search/pagination).
export const fetchAdminProducts = async (
  filters?: ProductFilters,
): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get<PaginatedResponse<Product>>("/admin/products", {
    params: filters,
  });
  return data;
};

// Create a new product.
export const createProduct = async (payload: ProductForm): Promise<Product> => {
  const { data } = await api.post<Product>("/admin/products", payload);
  return data;
};

// Update an existing product.
export const updateProduct = async (id: number, payload: ProductForm): Promise<Product> => {
  const { data } = await api.put<Product>(`/admin/products/${id}`, payload);
  return data;
};

// Delete a product.
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/admin/products/${id}`);
};

// Toggle product active/inactive status.
// Adjust the URL or method if your backend uses a different endpoint.
export const toggleProductStatus = async (id: number): Promise<Product> => {
  const { data } = await api.post<Product>(`/admin/products/${id}/toggle-status`);
  return data;
};
