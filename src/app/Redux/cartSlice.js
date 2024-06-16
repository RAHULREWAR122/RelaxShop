import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const updateLocalStorage = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

// Function to retrieve cart data from localStorage
export const getCartFromLocalStorage = () => {
  if (typeof window !== "undefined" && localStorage) {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
};

export const addToCart = createAsyncThunk("cart/addToCart", async (item) => {
  return { ...item, id: item._id };
});

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id) => {
    console.log("id get is ", id);
    return id;
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ id, quantity }) => {
    return { id, quantity };
  }
);

export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { getState }) => {
    const state = getState();
    const updatedItems = [];
    updateLocalStorage(updatedItems);
    return updatedItems;
  }
);

// Initial state
const initialState = {
  items: [],
  loading: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increaseQuantity: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.qty += 1;
        updateLocalStorage(state.items);
      }
    },
    decreaseQuantity: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem && existingItem.qty > 1) {
        existingItem.qty -= 1;
        updateLocalStorage(state.items);
      }
    },
    // Reducer to set the cart items, useful for initialization
    setCartItems: (state, action) => {
      state.items = action.payload;
      updateLocalStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existingItem = state.items.find(
          (item) => item.id === newItem._id
        );

        if (existingItem) {
          existingItem.qty += 1;
        } else {
          state.items.push({ ...newItem, qty: 1 });
        }
        updateLocalStorage(state.items);
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((item) => item._id !== id);
        updateLocalStorage(state.items);
      })

      .addCase(updateCart.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === id
        );

        if (existingItemIndex !== -1) {
          if (quantity === 0) {
            state.items.splice(existingItemIndex, 1);
          } else {
            state.items[existingItemIndex].qty = quantity;
          }
          updateLocalStorage(state.items);
        }
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { increaseQuantity, decreaseQuantity, setCartItems } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
export const cartSelector = (state) => state.cart.items;

export default cartReducer;
