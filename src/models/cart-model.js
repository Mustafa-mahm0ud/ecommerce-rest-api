import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    immutable: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variant: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: {
        type: Number,
        min: [1, "Quantity must be at least 1"],
        default: 1,
      },
    },
  ],
});

export default mongoose.model("Cart", CartSchema);
