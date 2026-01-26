// frontend\src\features\auth\authService.ts
import api from "../../services/api";

export const loginApi = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/login", data);
  return res.data;
};

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/register", data);
  return res.data;
};

export const meApi = async () => {
  const res = await api.get("/me");
  return res.data;
};
