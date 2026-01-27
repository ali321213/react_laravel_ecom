// These TypeScript interfaces describe the shape of cart-related data
// that we store in Redux for strong typing and better autocomplete.

// A single item inside the cart (one product with quantity).
export interface CartItem {
  id: number; // unique id for the cart item (from backend)
  product_id: number; // id of the related product
  name?: string; // optional name of the product
  price: number | string; // price per unit (string if backend returns string)
  quantity: number; // how many units of this product in the cart
}

// The full cart object returned by the backend.
export interface CartPayload {
  id?: number; // optional cart id
  items: CartItem[]; // list of items in the cart
}

// The Redux state for the cart slice.
export interface CartState {
  cart: CartPayload | null; // null when cart is not loaded yet
  loading: boolean; // true when we are fetching/updating cart
  error: string | null; // error message if something goes wrong
}
