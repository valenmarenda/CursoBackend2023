import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    quantity: {
      type: Number,
      default: 1,
    },
  }],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;