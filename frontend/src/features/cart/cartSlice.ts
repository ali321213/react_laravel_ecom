// This file defines the "cart" slice of Redux state.
// It is responsible for storing the current cart, loading state, and any errors.

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { CartPayload, CartState } from "./cartTypes";
import {
  addToCart as addToCartApi,
  fetchCart as fetchCartApi,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
} from "../../services/cart";

// ---------------- INITIAL STATE ----------------
const initialState: CartState = {
  cart: null, // the actual cart data from backend
  loading: false, // whether a cart request is in progress
  error: null, // error message if something goes wrong
};

// ---------------- ASYNC THUNKS ----------------

// Load the full cart from backend.
export const fetchCart = createAsyncThunk<CartPayload>(
  "cart/fetchCart",
  async () => {
    return await fetchCartApi();
  }
);

// Add a product to the cart.
export const addToCart = createAsyncThunk<
  CartPayload,
  { productId: number; quantity?: number }
>("cart/addToCart", async ({ productId, quantity = 1 }) => {
  return await addToCartApi(productId, quantity);
});

// Change the quantity of a specific cart item.
export const updateCartItemQuantity = createAsyncThunk<
  CartPayload,
  { itemId: number; quantity: number }
>("cart/updateCartItemQuantity", async ({ itemId, quantity }) => {
  return await updateCartItemApi(itemId, quantity);
});

// Remove a cart item completely.
export const removeCartItem = createAsyncThunk<CartPayload, number>(
  "cart/removeCartItem",
  async (itemId: number) => {
    return await removeCartItemApi(itemId);
  }
);

// ---------------- SLICE DEFINITION ----------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Clear the cart from state (useful on logout).
    clearCart(state) {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // When cart fetch starts: set loading and clear old errors.
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When cart fetch succeeds: save cart data.
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartPayload>) => {
          state.loading = false;
          state.cart = action.payload;
        }
      )
      // When cart fetch fails: stop loading and save error message.
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load cart";
      })
      // When addToCart succeeds: backend returns updated cart.
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // When quantity update succeeds: backend returns updated cart.
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // When removeCartItem succeeds: backend returns updated cart.
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

// Export reducer actions for this slice.
export const { clearCart } = cartSlice.actions;

// ---------------- SELECTORS ----------------
// Selectors are small functions to read data from the Redux state.

// Full cart slice state (cart + loading + error).
export const selectCartState = (state: RootState) => state.cart;

// Only the cart data (items, etc.).
export const selectCart = (state: RootState) => state.cart.cart;

// Loading flag for showing spinners.
export const selectCartLoading = (state: RootState) => state.cart.loading;

// Error message, if any.
export const selectCartError = (state: RootState) => state.cart.error;

// Total number of items in cart (sum of all item quantities).
export const selectCartCount = (state: RootState) =>
  state.cart.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

// Compute subtotal, tax, and total from cart items.
export const selectCartTotals = (state: RootState) => {
  const items = state.cart.cart?.items ?? [];

  // subtotal = sum(price * quantity) for each item
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const tax = subtotal * 0.1; // simple 10% tax (example)
  const total = subtotal + tax;

  return { subtotal, tax, total };
};

// Export the reducer to be used in the store.
export default cartSlice.reducer;
