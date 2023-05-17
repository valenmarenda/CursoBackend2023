import cartModel from "./Dao/models/carts.js";

class CartManagerMongo {
  constructor(path) {
    this.path = path;
  }

  async getCart(cid) {
    const cart = await cartModel.findOne({ _id: cid });

    if (!cart) {
      return {
        code: 400,
        status: "Error",
        message: "No se ha encontrado un cart con ese ID",
      };
    }

    return {
      code: 202,
      status: "Success",
      message: cart.products,
    };
  }

  async updateCart(cid, pid) {
    const cart = await cartModel.findOne({ _id: cid });

    const prodIndex = cart.products.findIndex((u) => u._id === pid);
    if (prodIndex === -1) {
      const product = {
        _id: pid,
        quantity: 1,
      };
      cart.products.push(product);
    } else {
      let total = cart.products[prodIndex].quantity;
      cart.products[prodIndex].quantity = total + 1;
    }

    const result = await cartModel.updateOne({ _id: cid }, { $set: cart });

    return {
      code: 202,
      status: "Success",
      message: cart.products,
    };
  }
  async getCart(cartId) {
    const cart = await cartModel.findById(cartId).populate("products.product");
    return cart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error("An error occurred while adding the product to the cart");
    }
  }
  async createCart() {
    const cart = new cartModel();
    await cart.save();
    return cart;
  }

  async addItemToCart(cartId, productId, quantity) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const existingItem = cart.products.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("An error occurred while adding the item to the cart");
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return null;
      }

      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
      );
      if (productIndex === -1) {
        return null;
      }

      cart.products.splice(productIndex, 1);
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
  async clearCart(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return null;
      }

      cart.products = [];
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
  async updateCart(cartId, products) {
    try {
      const cart = await cartModel.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      );

      return cart;
    } catch (error) {
      throw error;
    }
  }
  async updateCarts(cart) {
    try {
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error("Unable to update cart");
    }
  }
}

export default CartManagerMongo;
