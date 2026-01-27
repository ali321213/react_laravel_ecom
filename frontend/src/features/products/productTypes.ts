// Types for the products slice (Redux state for admin product CRUD).

import type { Product, ProductForm, ProductFilters, PaginatedResponse } from "../../types/product";

// State for the products list and CRUD operations.
export interface ProductState {
  // Current list of products shown in the table.
  items: Product[];

  // Currently selected product for editing (or null when none).
  selected: Product | null;

  // Loading + error flags for async operations.
  loading: boolean;
  error: string | null;

  // Filters for the list (search, pagination).
  filters: ProductFilters;

  // Pagination info from backend (you can reuse this pattern for other entities).
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

// Helper to create an initial pagination object from a response.
export const mapPagination = <T>(res: PaginatedResponse<T>) => ({
  currentPage: res.current_page ?? 1,
  lastPage: res.last_page ?? 1,
  perPage: res.per_page ?? res.data.length ?? 10,
  total: res.total ?? res.data.length ?? 0,
});

// Initial default state for products slice.
export const initialProductState: ProductState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    page: 1,
    perPage: 10,
  },
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  },
};
