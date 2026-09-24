import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    orderId: { type: String, required: true },
    paymentInfo: { type: String, default: "" },
    paymentMethod: { type: String, default: "online" },
    // [{ productId, title, price, qty, img }]
    products: { type: Object, required: true },
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    dis: { type: Number, default: 0 },
    status: { type: String },
    deliveryStatus: { type: String, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

export const Orders = mongoose.models.orders || mongoose.model("orders", OrdersSchema);
