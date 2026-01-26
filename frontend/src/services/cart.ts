import api from "../lib/axios";

export const addToCart = (productId: number, quantity = 1) => {
    return api.post("/cart/add", {
        product_id: productId,
        quantity,
    });
};

export const getCart = () => {
    return api.get("/cart");
};

export const fetchCart = () => api.get("/cart");

export const updateCartItem = (itemId: number, quantity: number) =>
    api.put(`/cart/item/${itemId}`, { quantity });

export const removeCartItem = (itemId: number) =>
    api.delete(`/cart/item/${itemId}`);
