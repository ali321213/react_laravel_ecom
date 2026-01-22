// src/features/auth/authTypes.ts

export type Role = "admin" | "vendor" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}
