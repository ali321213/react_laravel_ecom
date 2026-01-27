// This file defines **custom hooks** for Redux.
// Instead of importing useDispatch/useSelector everywhere,
// we use these typed versions: useAppDispatch, useAppSelector.

import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// useAppDispatch:
// - Same as useDispatch, but knows about our AppDispatch type (so thunks are typed).
export const useAppDispatch: () => AppDispatch = useDispatch;

// useAppSelector:
// - Same as useSelector, but knows the shape of our RootState.
// - This lets TypeScript auto-complete state.auth, state.cart, etc.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
