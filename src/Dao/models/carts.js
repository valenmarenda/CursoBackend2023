import mongoose from "mongoose";
const collection = "Carts";
const schema = new mongoose.Schema({
  products:{
    type: Array,
    default: []
}
});
const cartModel = mongoose.model(collection,schema);
export default cartModel;