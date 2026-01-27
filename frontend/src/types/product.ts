// Reusable TypeScript types for products and product CRUD.

// One product record as returned by the backend.
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock?: number;
  is_active: boolean;
  // Add more fields based on your backend (category_id, vendor_id, etc.)
  [key: string]: any;
}

// Fields needed when creating/updating a product from a form.
export interface ProductForm {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  is_active?: boolean;
  // Extend with other fields (category_id, vendor_id, etc.)
}

// Optional filters for listing products (search, pagination).
export interface ProductFilters {
  search?: string;
  page?: number;
  perPage?: number;
}

// Generic paginated response shape you can reuse for other entities.
export interface PaginatedResponse<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}
