import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import url from "url";
import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import productModel from "../Dao/models/products.js";
import ProductManagerMongo from "../productsmanager.js";

const managerAcces = new ManagerAccess();

const productsPath = "src/files/Products.json";
const router = Router();
const productManagerMongo = new ProductManagerMongo();

router.get("/:limit?", async (req, res) => {
  try {
    const limite = req.params.limit || 10;

    const result = await productModel.find().limit(Number(limite));

    res.send({ result });

    if (result.length !== 0) {
      res.send({ result });
    } else {
      res.send({ status: "File does not contain products" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ status: "error", error: "An error has occurred" });
  }
});
router.get("/", async (request, response) => {
  try {
    const respuesta = await productManagerMongo.getProducts();

    response.status(respuesta.code).send({
      status: respuesta.status,
      message: respuesta.message,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send({ status: "error", error: "An error has occurred" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await managerAcces.crearRegistro("Consulta un solo usuario");
    const id = req.params.id;

    const result = await productModel.findById({ _id: id });
    res.send({ result });
    if (!result) {
      return res.send({
        error: "Product not found.",
      });
    }
    res.send({ status: "success", payload: product });
  } catch (err) {
    res.status(404).send({ status: "error", error: "An error has occurred" });
  }
});

router.post("/", async (req, res) => {
  try {
    await managerAcces.crearRegistro("Added product");
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send({
        status: "error",
        error: "All fields are required, except thumbnails",
      });
    }
    const product = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };
    const result = await productModel.create(product);
    res.send({ result });
  } catch (error) {
    res.status(404).send({ status: "error", error: "An error has occurred" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await managerAcces.crearRegistro("Elimina un usuario");

    const id = req.params.id;
    const result = await productModel.deleteOne({ _id: id });
    //const result = await productModel.findOneAndDelete({ _id: id });
    res.send({ result });
  } catch (err) {
    res.status(500).send("Error deleting the product");
  }
});

router.put("/:id", async (req, res) => {
  try {
    await managerAcces.crearRegistro("Actualiza un usuario");

    const id = req.params.uid;
    const newUser = req.body;

    const result = await productModel.updateOne({ _id: id }, { $set: newUser });
    //    const result = await productModel.findByIdAndUpdate(id, newUser, {new: true,});

    res.send({ result });
    /*
    const data = await readFile(productsPath);
    const products = JSON.parse(data);

    const index = products.findIndex((p) => p.id_product === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        title: title || products[index].title,
        description: description || products[index].description,
        code: code || products[index].code,
        price: price || products[index].price,
        status: status || products[index].status,
        stock: stock || products[index].stock,
        category: category || products[index].category,
        thumbnails: thumbnails || products[index].thumbnails,
      };
      await writeFile(productsPath, JSON.stringify(products));

      if (req.body.hasOwnProperty("id_product")) {
        res.send(
          `Product with id_product ${id} cannot be updated, it is not allowed to modify the id.`
        );
      } else {
        res.send(`Product with id_product ${id} has been updated`);
      }
    } else {
      res.status(404).send(`Product with id_product ${id} not found`);
    }*/
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the product");
  }
});

export default router;
