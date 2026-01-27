// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk<CartPayload>(
  "cart/fetchCart",
  async () => {
    return await fetchCartApi();
  }
);

export const addToCart = createAsyncThunk<
  CartPayload,
  { productId: number; quantity?: number }
>("cart/addToCart", async ({ productId, quantity = 1 }) => {
  return await addToCartApi(productId, quantity);
});

export const updateCartItemQuantity = createAsyncThunk<
  CartPayload,
  { itemId: number; quantity: number }
>("cart/updateCartItemQuantity", async ({ itemId, quantity }) => {
  return await updateCartItemApi(itemId, quantity);
});

export const removeCartItem = createAsyncThunk<CartPayload, number>(
  "cart/removeCartItem",
  async (itemId: number) => {
    return await removeCartItemApi(itemId);
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartPayload>) => {
          state.loading = false;
          state.cart = action.payload;
        }
      )
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load cart";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectCartState = (state: RootState) => state.cart;
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;

export const selectCartCount = (state: RootState) =>
  state.cart.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

export const selectCartTotals = (state: RootState) => {
  const items = state.cart.cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

export default cartSlice.reducer;
