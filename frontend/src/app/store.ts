// This file creates the Redux "store" = the single place where global state lives.
// We use Redux Toolkit's configureStore to make setup easier and with good defaults.

import { configureStore } from "@reduxjs/toolkit";

// Each "slice" manages a part of the global state (auth, cart, etc.).
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productSlice";

// Create the store and register all slices under a key.
// The keys (auth, cart) become state.auth, state.cart in the Redux state tree.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
  },
});

// RootState = the full type of our Redux state object.
// Example: RootState["auth"] is the auth slice state.
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch = type for the dispatch function. We use this with our custom hook.
export type AppDispatch = typeof store.dispatch;
