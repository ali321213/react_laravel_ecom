import axios from "../lib/axios";

export const addToCart = async (productId: number, quantity = 1) => {
  const res = await axios.post("/cart/add", {
    product_id: productId,
    quantity,
  });
  return res.data;
};

export const fetchCart = async () => {
  const res = await axios.get("/cart");
  return res.data;
};

export const updateCartItem = async (id: number, quantity: number) => {
  return axios.put(`/cart/item/${id}`, { quantity });
};

export const removeCartItem = async (id: number) => {
  return axios.delete(`/cart/item/${id}`);
};
