import mongoose from "mongoose";
const collection = "Carts";
const schema = new mongoose.Schema({
 products: [{
    id: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
});
const cartModel = mongoose.model(collection,schema);
export default cartModel;