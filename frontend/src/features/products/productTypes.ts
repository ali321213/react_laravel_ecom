import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import { loginApi, meApi } from "./authService";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    return await loginApi(data);
  }
);

export const me = createAsyncThunk("auth/me", async () => {
  return await meApi();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(me.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
