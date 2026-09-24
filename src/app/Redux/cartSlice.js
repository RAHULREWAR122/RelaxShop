import { createSlice } from "@reduxjs/toolkit";

export const CART_KEY = "cart";

// Guests share the plain key; each signed-in user gets their own saved bag.
export const cartKey = (owner) => (owner ? `${CART_KEY}:${owner.toLowerCase()}` : CART_KEY);

// Turns a product (or a cart line saved by an older version of the app) into a cart line.
function toLine(product, qty) {
  return {
    id: String(product.id || product._id),
    title: product.title,
    price: Number(product.price) || 0,
    thumbnail: product.thumbnail,
    category: product.category,
    stock: Number.isFinite(product.stock) ? product.stock : product.availableQty ?? null,
    qty,
  };
}

function clamp(qty, stock) {
  const n = Math.max(1, Math.floor(qty));
  return Number.isFinite(stock) && stock > 0 ? Math.min(n, stock) : n;
}

export function loadCart(key = CART_KEY) {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(raw)) return [];
    // Older carts stored an unreliable `availableQty`, so only trust `stock`.
    return raw
      .filter((l) => l && (l.id || l._id))
      .map((l) => ({ ...toLine(l, Math.max(1, Math.floor(l.qty) || 1)), stock: Number.isFinite(l.stock) ? l.stock : null }));
  } catch {
    return [];
  }
}

// Adds the lines of `extra` onto `base`, summing quantities of the same product.
export function mergeCarts(base, extra) {
  const merged = base.map((l) => ({ ...l }));
  for (const line of extra) {
    const existing = merged.find((l) => l.id === line.id);
    if (existing) existing.qty = clamp(existing.qty + line.qty, existing.stock ?? line.stock);
    else merged.push({ ...line });
  }
  return merged;
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], owner: null, hydrated: false },
  reducers: {
    // Loads the bag belonging to `owner` (a user's email, or null for a guest).
    hydrateCart(state, action) {
      state.items = action.payload.items;
      state.owner = action.payload.owner ?? null;
      state.hydrated = true;
    },
    addToCart(state, action) {
      const { product, qty = 1 } = action.payload;
      const id = String(product._id || product.id);
      const existing = state.items.find((l) => l.id === id);
      if (existing) {
        existing.stock = product.availableQty ?? existing.stock;
        existing.qty = clamp(existing.qty + qty, existing.stock);
      } else {
        const line = toLine(product, 0);
        line.qty = clamp(qty, line.stock);
        state.items.push(line);
      }
    },
    setQuantity(state, action) {
      const { id, qty } = action.payload;
      const line = state.items.find((l) => l.id === id);
      if (line) line.qty = clamp(qty, line.stock);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((l) => l.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    // Refresh prices and stock from the live catalogue (which lists in-stock items only).
    syncWithCatalog(state, action) {
      const byId = new Map(action.payload.map((p) => [String(p._id), p]));
      for (const line of state.items) {
        const p = byId.get(line.id);
        if (!p) {
          line.unavailable = true;
          continue;
        }
        line.unavailable = false;
        line.price = p.price;
        line.title = p.title;
        line.thumbnail = p.thumbnail;
        line.stock = p.availableQty;
        line.qty = clamp(line.qty, line.stock);
      }
    },
  },
});

export const { hydrateCart, addToCart, setQuantity, removeFromCart, clearCart, syncWithCatalog } = cartSlice.actions;
export const cartSelector = (state) => state.cart.items;
export const cartCountSelector = (state) => state.cart.items.reduce((n, l) => n + l.qty, 0);
export const cartHydratedSelector = (state) => state.cart.hydrated;

export default cartSlice.reducer;
