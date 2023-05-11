import { Router } from "express";
//import { readFile, writeFile } from "fs/promises";
//import fs from "fs/promises";
//import ManagerAccess from "../Dao/managers/ManagerAcces.js";
//const managerAcces = new ManagerAccess() 
import cartModel from "../Dao/models/carts.js";

const router = Router();
//const carritoPath = "src/files/Carrito.json";
//const productsPath = "src/files/products.json";



router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const cart = await cartModel.findById(id);

    if (!cart) {
      return res.json({ status: "Product not found." });
    }

    return res.json(cart.products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error has occurred" });
  }
});


router.post("/", async (req, res) => {
  const { products } = req.body;
  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: "The 'products' field is required and must be an array" });
  }

  try {
    const newCart = await cartModel.create({ products });

    return res.status(201).json(newCart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Ocurrió un error al crear el carrito" });
  }
});


router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.json({ status: "not found." });
    }
    const existingProduct = cart.products.find((product) => product.product === pid);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    return res.json(cart.products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error has occurred" });
  }
});


export default router;
