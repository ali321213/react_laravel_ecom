// frontend\src\app\store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// ✅ THESE TWO LINES ARE REQUIRED
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
