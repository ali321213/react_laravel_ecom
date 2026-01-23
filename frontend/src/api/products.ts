import axios from "axios";

export const fetchProducts = async () => {
  const { data } = await axios.get("http://localhost:8000/api/products");
  return data;
};
