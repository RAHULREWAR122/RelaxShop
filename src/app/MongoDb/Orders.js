import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    orderId :{ type: String, required: true },
    paymentInfo : { type: String, default:'' },
    products:  { type: Object , required : true},
    address: { type: String, required: true },
    amount: { type: Number, required: true },
    dis :{type : Number ,default : 0},
    status: { type: String },
    deliveryStatus : {type : String , default : "Pending" }
  },
  {
    timestamps: true,
  }
);

export const Orders = mongoose.models.orders || mongoose.model("orders", OrdersSchema);

