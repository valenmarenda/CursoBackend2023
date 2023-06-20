import { Router } from "express";
import cartModel from "../Dao/models/carts.js";
import CartManagerMongo from "../controllers/cartmanager.js"
import productModel from "../Dao/models/products.js";
const router = Router();

const cartManager = new CartManagerMongo();

router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.json({ status: 'success', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await cartModel.findById(cid).populate("products.product");

    if (!cart) {
      return res.json({ status: "Cart not found" });
    }

    return res.json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: "An error has occurred" });
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const cart = await cartManager.addItemToCart(cartId, productId, quantity);
    res.json({ status: 'success', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cart = await cartManager.removeProductFromCart(cartId, productId);
    if (!cart) {
      return res.json({ status: 'error', message: 'Cart or product not found' });
    }
    res.json({ status: 'success', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});


router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.clearCart(cartId);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Cart not found' });
    }

    return res.json({ status: 'success', message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});

router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;

  try {
    const cart = await cartManager.updateCart(cartId, products);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Cart not found' });
    }

    return res.json({ status: 'success', message: 'Cart updated successfully', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: 'An error occurred' });
  }
});


router.put("/api/carts/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ status: "error", error: "Product not found in cart" });
    }
    cart.products[productIndex].quantity = quantity;
    const updatedCart = await cartManager.updateCarts(cart);

    return res.json({ status: "success", cart: updatedCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: "An error has occurred" });
  }
});



export default router;
