// Products slice: reusable pattern for admin CRUD (list/create/update/delete/toggle).
// You can copy this structure to build CRUD for other entities (users, categories, etc.).

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { Product, ProductForm, ProductFilters } from "../../types/product";
import {
  createProduct,
  deleteProduct,
  fetchAdminProducts,
  toggleProductStatus,
  updateProduct,
} from "../../services/productService";
import { initialProductState, mapPagination, type ProductState } from "./productTypes";

// ------------ ASYNC THUNKS ------------

// Fetch products list (admin).
export const fetchProducts = createAsyncThunk<
  { items: Product[]; filters: ProductFilters; pagination: ProductState["pagination"] },
  ProductFilters | undefined
>("products/fetchProducts", async (filters) => {
  const res = await fetchAdminProducts(filters);
  return {
    items: res.data,
    filters: filters ?? {},
    pagination: mapPagination(res),
  };
});

// Create a new product.
export const createProductThunk = createAsyncThunk<Product, ProductForm>(
  "products/createProduct",
  async (payload) => {
    return await createProduct(payload);
  },
);

// Update an existing product.
export const updateProductThunk = createAsyncThunk<
  Product,
  { id: number; data: ProductForm }
>("products/updateProduct", async ({ id, data }) => {
  return await updateProduct(id, data);
});

// Delete a product.
export const deleteProductThunk = createAsyncThunk<number, number>(
  "products/deleteProduct",
  async (id) => {
    await deleteProduct(id);
    return id;
  },
);

// Toggle product active/inactive.
export const toggleProductStatusThunk = createAsyncThunk<Product, number>(
  "products/toggleStatus",
  async (id) => {
    return await toggleProductStatus(id);
  },
);

// ------------ SLICE ------------

const productsSlice = createSlice({
  name: "products",
  initialState: initialProductState,
  reducers: {
    // Set currently selected product (for edit modal).
    setSelectedProduct(state, action: PayloadAction<Product | null>) {
      state.selected = action.payload;
    },
    // Update filters locally (e.g. search text, page).
    setProductFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder
      // Fetch list
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
        state.filters = {
          ...state.filters,
          ...action.payload.filters,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load products";
      })

      // Create
      .addCase(createProductThunk.fulfilled, (state, action) => {
        // Prepend new product to list (you can also refetch list instead).
        state.items.unshift(action.payload);
      })

      // Update
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })

      // Delete
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })

      // Toggle active/inactive
      .addCase(toggleProductStatusThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      });
  },
});

export const { setSelectedProduct, setProductFilters } = productsSlice.actions;

// ------------ SELECTORS ------------

export const selectProductsState = (state: RootState) => state.products;
export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsFilters = (state: RootState) => state.products.filters;
export const selectProductsPagination = (state: RootState) => state.products.pagination;
export const selectSelectedProduct = (state: RootState) => state.products.selected;

export default productsSlice.reducer;
