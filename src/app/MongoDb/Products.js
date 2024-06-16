import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  desc: { type: String, required: true },
  rating: { type: Number, required: true },
  imgs: {
    type: [String],
    required: true,
  },
  availableQty: { required: true, type: Number },
  category: { type: String, required: true },
});

export const Product = mongoose.models.products || mongoose.model("products", ProductSchema);

