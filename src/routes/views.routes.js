import { Router } from "express";
import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import productModel from "../Dao/models/products.js";
import ProductManagerMongo from "../productsmanager.js";
import cartModel from "../Dao/models/carts.js";
import CartManagerMongo from "../cartmanager.js"
const cartManager = new CartManagerMongo();
const managerAcces = new ManagerAccess();

const router = Router();

const productManager = new ProductManagerMongo();

router.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort;
  const category = req.query.category;
  const availability = req.query.availability;

  try {
    const products = await productManager.getProducts(
      limit,
      page,
      sort,
      category,
      availability
    );
    const plainProducts = products.payload.map((product) => product.toObject());
    res.render("products", { products: plainProducts, object: products });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
});

router.get("/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await productManager.getProductById(id);
    if (!product) {
      return res.json({ status: "Product not found" });
    }
    const plainProduct = product.toObject();
    res.render("product-details", { product: plainProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: "An error has occurred" });
  }
});

router.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
      const cart = await cartModel.findById(cid).populate("products.product");
      if (!cart) {
        return res.json({ status: "Cart not found" });
      }
      const plainCarts = cart.products.map((product) => product.toObject());
      res.render('cart-details', { cart: plainCarts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "error", error: "An error has occurred" });
    }
  });
  

export default router;
