// This file defines the "auth" slice of Redux state.
// It handles login/logout and loading the current user ("me").

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import { loginApi, meApi } from "./authService";

// ---------------- INITIAL STATE ----------------
// Default values when the app first loads.
const initialState: AuthState = {
  user: null, // user info (role, name, etc.)
  token: localStorage.getItem("token"), // read token from localStorage if it exists
  loading: false, // could be used to show a loading spinner when auth is happening
};

// ---------------- ASYNC THUNKS ----------------
// createAsyncThunk is used for async operations (calling API and then updating state).

// LOGIN thunk: called with email/password, calls loginApi and returns its result.
export const login = createAsyncThunk(
  "auth/login", // action type string
  async (data: { email: string; password: string }) => {
    return await loginApi(data);
  }
);

// ME thunk: fetch the currently authenticated user using the saved token.
export const me = createAsyncThunk("auth/me", async () => {
  return await meApi();
});

// ---------------- SLICE DEFINITION ----------------
const authSlice = createSlice({
  name: "auth", // slice name (shows up in Redux DevTools)
  initialState,
  reducers: {
    // Synchronous reducer for logging out.
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token"); // also clear token from localStorage
    },
  },
  extraReducers(builder) {
    // Handle results of async thunks.
    builder
      // When login is successful:
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token); // persist token
      })
      // When "me" is successful (on page reload with valid token)
      .addCase(me.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

// Export the logout action to use in components.
export const { logout } = authSlice.actions;

// Export the reducer to be registered in the store.
export default authSlice.reducer;