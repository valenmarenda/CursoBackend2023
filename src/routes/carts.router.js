import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import fs from "fs/promises";

const router = Router();
const carritoPath = "files/Carrito.json";
const productsPath = "files/products.json";

router.get("/:id", async (req, res) => {
  try {
    const data = await readFile(carritoPath);
    const products = JSON.parse(data);
    const id = req.params.id;
    let product = products.find((p) => {
      return p.id == id.toString();
    });
    if (!product) {
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
    const products = [];
    const data = await readFile(carritoPath);
    const productsData = JSON.parse(data);
    const maxId = productsData.reduce(
      (max, product) => Math.max(max, product.id),
      0
    );
    const newProductId = maxId + 1;

    const newProduct = {
      id: newProductId,
      products,
    };

    productsData.push(newProduct);

    await writeFile(carritoPath, JSON.stringify(productsData));
    res.send({ status: "success", payload: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartData = await fs.readFile(carritoPath, "utf8");
    const carrito = JSON.parse(cartData);

    const cid = parseInt(req.params.cid);
    const cartIndex = carrito.findIndex((c) => c.id === cid);
    if (cartIndex === -1) {
      throw new Error(`There is no cart with ID ${cid}`);
    }

    const productsData = await fs.readFile(productsPath, "utf8");
    const productos = JSON.parse(productsData);

    const pid = parseInt(req.params.pid);
    const productIndex = productos.findIndex((p) => p.id_product === pid);
    if (productIndex === -1) {
      throw new Error(`There is no product with ID ${pid}`);
    }

    const producto = { id: pid, quantity: 1 };
    const existingIndex = carrito[cartIndex].products.findIndex(
      (p) => p.id === pid
    );
    if (existingIndex === -1) {
      carrito[cartIndex].products.push(producto);
    } else {
      carrito[cartIndex].products[existingIndex].quantity++;
    }

    await fs.writeFile(carritoPath, JSON.stringify(carrito, null, 2));

    res.send({
      status: "success",
      payload: `Product ${pid} added to cart ${cid}`,
    });
  } catch (error) {
    res.status(404).send("Error adding product to cart");
  }
});
export default router;
