export interface CartItem {
  id: number;
  product_id: number;
  name?: string;
  price: number | string;
  quantity: number;
}

export interface CartPayload {
  id?: number;
  items: CartItem[];
}

export interface CartState {
  cart: CartPayload | null;
  loading: boolean;
  error: string | null;
}
