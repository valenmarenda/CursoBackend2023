import { Router } from "express";
import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import productModel from "../Dao/models/products.js";
import ProductManagerMongo from "../productsmanager.js";
import cartModel from "../Dao/models/carts.js";
import CartManagerMongo from "../cartmanager.js";
const cartManager = new CartManagerMongo();
const managerAcces = new ManagerAccess();

const router = Router();

const productManager = new ProductManagerMongo();
const publicAcces = (req, res, next) => {
  if (req.session.user) return res.redirect("/profile");
  next();
};

const privateAcces = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  next();
};
const adminAccess = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.rol !== "admin") {
    return res.status(403).send({ status: "error", error: "Access denied" });
  }

  next();
};

router.get("/products", privateAcces, async (req, res) => {
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
    res.render("products", {
      products: plainProducts,
      object: products,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
});

router.get("/products/:id", privateAcces, async (req, res) => {
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

router.get("/carts/:cid", privateAcces, async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartModel.findById(cid).populate("products.product");
    if (!cart) {
      return res.json({ status: "Cart not found" });
    }
    const plainCarts = cart.products.map((product) => product.toObject());
    res.render("cart-details", { cart: plainCarts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: "An error has occurred" });
  }
});

router.get("/register", publicAcces, (req, res) => {
  res.render("register");
});

router.get("/login", publicAcces, (req, res) => {
  res.render("login");
});
router.get("/", privateAcces, (req, res) => {
  res.render("notfound");
});

router.get("/profile", privateAcces, (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

router.get("/admin", adminAccess, (req, res) => {
  res.render("admin", {
    user: req.session.user,
  });
});

export default router;
