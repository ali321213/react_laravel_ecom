import api from "../lib/axios";

export const addToCart = async (productId: number, quantity = 1) => {
  const { data } = await api.post("/cart/add", {
    product_id: productId,
    quantity,
  });
  return data;
};

export const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const fetchCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const { data } = await api.put(`/cart/item/${itemId}`, { quantity });
  return data;
};

export const removeCartItem = async (itemId: number) => {
  const { data } = await api.delete(`/cart/item/${itemId}`);
  return data;
};

export const fetchCartCount = async () => {
  const { data } = await api.get("/cart/count");
  return data.count;
};
