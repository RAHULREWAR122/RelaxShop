import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/app/Redux/cartSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;