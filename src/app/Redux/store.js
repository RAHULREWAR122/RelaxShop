import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { cartKey } from "@/app/Redux/cartSlice";

export function makeStore() {
  const store = configureStore({ reducer: { cart: cartReducer } });

  // Persist the bag, under its owner's key, once it has been loaded from storage.
  let last;
  store.subscribe(() => {
    const { items, owner, hydrated } = store.getState().cart;
    if (!hydrated || items === last) return;
    last = items;
    try {
      localStorage.setItem(cartKey(owner), JSON.stringify(items));
    } catch {}
  });

  return store;
}
