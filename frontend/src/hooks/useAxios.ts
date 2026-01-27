// frontend/src/hooks/useAxios.ts
import axios from "axios";
import { useSelector } from "react-redux";

export function useAxios() {
  const token = useSelector((state: any) => state.auth.token);

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  instance.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return instance;
}
