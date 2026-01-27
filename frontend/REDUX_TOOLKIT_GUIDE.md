## Redux Toolkit in this project (super simple guide)

This page explains **how Redux Toolkit (RTK)** works in your app, **step by step, like a beginner**, and how you can write code with it.

---

## 1. Big picture: what Redux Toolkit does here

In this frontend:

- **`store.ts`** = the **central box** that holds all global state.
- **Slices** (like `authSlice.ts`, `cartSlice.ts`) = **named sections** of that box.
- **Thunks** (async actions) = functions that **call the API** and then **update the slice**.
- **Selectors** = small functions that **read data from the store**.
- **Hooks** = helpers to **use Redux in React components** easily.

So the flow is:

1. **Component** dispatches an action/thunk (`dispatch(fetchCart())`).
2. Thunk **talks to backend** (Laravel API).
3. Slice’s `extraReducers` **update the state** based on success/fail.
4. Components **read the latest state** using selectors and hooks.

---

## 2. Where the Redux files live

- **Store**
  - `src/app/store.ts`
- **Typed hooks for Redux**
  - `src/app/hooks.ts`
- **Auth slice**
  - `src/features/auth/authSlice.ts`
- **Cart slice**
  - `src/features/cart/cartSlice.ts`
  - `src/features/cart/cartTypes.ts`
- **Services (API calls)**
  - `src/services/cart.ts`
  - `src/features/auth/authService.ts`

You will mostly touch:

- `store.ts`
- `features/**/someSlice.ts`
- `app/hooks.ts`
- Your React components in `pages/` or `components/`.

---

## 3. The store: combining all slices

File: `src/app/store.ts`

The store is created with `configureStore` and combines slices:

```ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
```

Now your **global state** looks like:

```ts
state = {
  auth: { ...auth stuff... },
  cart: { ...cart stuff... },
};
```

---

## 4. Typed hooks: how components talk to Redux

File: `src/app/hooks.ts`

We created **typed hooks** so you don’t have to write types all the time:

```ts
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

You will use these in components:

- **`useAppDispatch()`** → to dispatch actions / thunks.
- **`useAppSelector()`** → to read data from the store.

Example:

```ts
const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

---

## 5. Auth slice: example of a basic slice with thunks

File: `src/features/auth/authSlice.ts`

Key ideas:

- `initialState` holds **default values**.
- `createAsyncThunk` is used for **async calls** (login, me).
- `createSlice` defines **reducers** and how to handle async results.

Very simplified view:

```ts
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
};

export const login = createAsyncThunk("auth/login", async (data) => {
  return await loginApi(data); // calls backend
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
  },
});
```

**How you use it in a component:**

```ts
const dispatch = useAppDispatch();

const handleLogin = () => {
  dispatch(login({ email, password }));
};
```

---

## 6. Cart slice: how your cart is managed with RTK

Files:

- `src/features/cart/cartTypes.ts`
- `src/features/cart/cartSlice.ts`
- `src/services/cart.ts`
- `src/hooks/useCart.ts`
- `src/hooks/useCartCount.ts`

### 6.1 Cart types

`cartTypes.ts` just defines **TypeScript shapes**:

```ts
export interface CartItem {
  id: number;
  product_id: number;
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
```

### 6.2 Cart API helpers

File: `src/services/cart.ts`

These functions talk directly to your Laravel API and **return data only**:

```ts
export const fetchCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};
```

Similar for `addToCart`, `updateCartItem`, `removeCartItem`.

### 6.3 Cart thunks + slice

File: `src/features/cart/cartSlice.ts`

**Thunks** call the API and return the response:

```ts
export const fetchCart = createAsyncThunk<CartPayload>(
  "cart/fetchCart",
  async () => {
    return await fetchCartApi();
  }
);
```

The slice handles loading, success, and error:

```ts
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load cart";
      });
  },
});
```

### 6.4 Cart selectors

Still in `cartSlice.ts`, selectors are used to **read computed data**:

```ts
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartCount = (state: RootState) =>
  state.cart.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
```

You don’t call these directly from components – you usually use them through `useAppSelector`.

### 6.5 `useCart` hook (how components use cart easily)

File: `src/hooks/useCart.ts`

This hook **connects auth + Redux cart**:

```ts
const { isLoggedIn } = useAuth();
const dispatch = useAppDispatch();

const cart = useAppSelector(selectCart);
const loading = useAppSelector(selectCartLoading);
const count = useAppSelector(selectCartCount);
const { subtotal, tax, total } = useAppSelector(selectCartTotals);

useEffect(() => {
  if (!isLoggedIn) return;
  dispatch(fetchCart());
}, [isLoggedIn, dispatch]);
```

And exposes helpers:

```ts
const updateQuantity = (itemId: number, qty: number) => {
  if (qty < 1) return;
  dispatch(updateCartItemQuantity({ itemId, quantity: qty }));
};

const removeItem = (itemId: number) => {
  dispatch(removeCartItem(itemId));
};
```

So in a **Cart page**, you just do:

```ts
const { cart, loading, subtotal, total, updateQuantity, removeItem } =
  useCart();
```

You **don’t worry about API calls** here; RTK + thunks handle it.

### 6.6 `useCartCount` hook (for navbar badge)

File: `src/hooks/useCartCount.ts`

Simplified to only use Redux:

```ts
export const useCartCount = () => {
  const count = useAppSelector(selectCartCount);
  return { data: count };
};
```

In `Navbar.tsx`:

```ts
const { data: cartCount } = useCartCount();
```

---

## 7. How to add a NEW slice (copy-paste friendly)

Example: you want a new slice `wishlist`.

1. **Create slice file**: `src/features/wishlist/wishlistSlice.ts`
2. **Define state + initialState**
3. **Create thunks** for API calls
4. **Create the slice** with `createSlice`
5. **Export selectors**
6. **Register the slice in `store.ts`**
7. **Use it in components** with `useAppDispatch` / `useAppSelector`

Very small template:

```ts
// src/features/example/exampleSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface ExampleState {
  items: string[];
  loading: boolean;
}

const initialState: ExampleState = {
  items: [],
  loading: false,
};

export const fetchExamples = createAsyncThunk("example/fetch", async () => {
  // call API here
  return ["a", "b", "c"];
});

const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchExamples.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamples.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  },
});

export const selectExampleItems = (state: RootState) => state.example.items;
export default exampleSlice.reducer;
```

Then update `store.ts`:

```ts
import exampleReducer from "../features/example/exampleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    example: exampleReducer,
  },
});
```

Use in a component:

```ts
const dispatch = useAppDispatch();
const items = useAppSelector(selectExampleItems);

useEffect(() => {
  dispatch(fetchExamples());
}, [dispatch]);
```

---

## 8. When you write new code with RTK, think like this

1. **Do I need this value globally?**
   - Yes → put it in a **slice**.
   - No → use local `useState` in that component.
2. **Does it need to call the backend?**
   - Yes → create a **thunk** (`createAsyncThunk`) that calls a service file.
3. **How will components get the data?**
   - Create **selectors** and/or **custom hooks**.
4. **How will UI trigger the change?**
   - Use `useAppDispatch()` and `dispatch(yourThunk(payload))`.

If you tell me “I want to add feature X (e.g. wishlist, addresses, notifications)”, I can give you a copy-paste RTK setup for that feature too.

