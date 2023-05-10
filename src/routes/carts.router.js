import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import fs from "fs/promises";
import ManagerAccess from "../Dao/managers/ManagerAcces.js";
import CartManagerMongo from "../cartmanager.js"
const managerAcces = new ManagerAccess() 
import cartModel from "../Dao/models/carts.js";

const router = Router();
const carritoPath = "src/files/Carrito.json";
const productsPath = "src/files/products.json";
const cartManagerMongo = new CartManagerMongo();

router.get('/', async(request, response) => {

  const respuesta = await cartManagerMongo.getCarts();

  response.status(respuesta.code).send({
      status: respuesta.status,
      message: respuesta.message
  });
})


router.get("/:id", async (req, res) => {
  try {
    await managerAcces.crearRegistro("Consulta una sola cart");
    const id = req.params.id;
    const result = await cartManagerMongo.getCart(id);
    res.send({ result });
    if (!result) {
      return res.send({
        error: "Product not found.",
      });
    }
    res.send({ status: "success", payload: result });
  } catch (err) {
    res.status(404).send({ status: "error", error: "An error has occurred" });
  }
});

router.post("/", async (req, res) => {
  try {
    await managerAcces.crearRegistro("Added to cart");
    const products = [];
    const carts = await cartModel.find({});
    const maxId = carts.reduce(
      (max, cart) => Math.max(max, cart.id),
      0
    );
    const newCartId = maxId + 1;

    const newCart = new cartModel({
      id: newCartId,
      products,
    });

    await newCart.save();
    res.send({ status: "success", payload: newCart });
  } catch (error) {
    res.status(404).send({ status: "error", error: "An error has occurred" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const cart = await cartModel.findOne({ id: cid });
    if (!cart) {
      throw new Error(`There is no cart with ID ${cid}`);
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.id === pid
    );
    if (existingProductIndex === -1) {
      cart.products.push({ id: pid, quantity: 1 });
    } else {
      cart.products[existingProductIndex].quantity++;
    }

    await cart.save();

    res.send({
      status: "success",
      payload: `Product ${pid} added to cart ${cid}`,
    });
  } catch (error) {
    res.status(404).send("Error adding product to cart");
  }
});

export default router;
