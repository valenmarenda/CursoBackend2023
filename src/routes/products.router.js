import { Router } from "express";
//import { readFile, writeFile } from "fs/promises";
//import url from "url";
import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import productModel from "../Dao/models/products.js";
//import ProductManagerMongo from "../productsmanager.js";

const managerAcces = new ManagerAccess();

//const productsPath = "src/files/Products.json";
const router = Router();
//const productManagerMongo = new ProductManagerMongo();

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    let result;
    if (limit > 0) {
      result = await productModel.find().limit(limit);
    } else {
      result = await productModel.find();
    }

    if (result.length === 0) {
      return res.json({ status: "File does not contain products" });
    } else {
      return res.json({ result });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "error", error: "An error has occurred" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.json({ status: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: "An error has occurred" });
  }
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({
      error: "All fields are required, except thumbnails",
    });
  }
  try {
    await managerAcces.crearRegistro("Added product");
    const newProduct = await productModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
    });

    return res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).send({ status: "error", error: "An error has occurred" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.json({ status: "Product not found" });
    }

    return res.json({ status: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error has occurred" });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.json({ status: "Product not found" });
    }

    // Combinar las actualizaciones con los campos existentes del producto
    const updatedProduct = { ...existingProduct.toObject(), ...updates };

    const result = await productModel.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });

    return res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error has occurred" });
  }
});

export default router;
