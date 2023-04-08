import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import url from "url";
const productsPath = "files/products.json";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await readFile(productsPath);
    const products = JSON.parse(data);
    const queryParams = url.parse(req.url, true).query;
    const limit = queryParams.limit;
    const results = limit ? products.slice(0, limit) : products;
    if (Object.keys(products).length !== 0) {
      res.send({ status: "success", payload: results });
    } else {
      res.send({ status: "File does not contain products" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ status: "error", error: "An error has occurred" });
  }
});

router.get("/:id_product", async (req, res) => {
  try {
    const data = await readFile(productsPath);
    const products = JSON.parse(data);
    const id_product = req.params.id_product;
    let product = products.find((p) => {
      return p.id_product == id_product.toString();
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
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = req.body;

    const data = await readFile(productsPath);
    const products = JSON.parse(data);

    const maxId = products.reduce(
      (max, product) => Math.max(max, product.id_product),
      0
    );
    const newProductId = maxId + 1;
    const newProduct = {
      id_product: newProductId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    products.push(newProduct);

    await writeFile(productsPath, JSON.stringify(products));
    res.send({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(404).send({ status: "error", error: "An error has occurred" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    try {
      const data = await readFile(productsPath);
      const products = JSON.parse(data);

      const index = products.findIndex((p) => p.id_product === id);
      if (index !== -1) {
        products.splice(index, 1);
        await writeFile(productsPath, JSON.stringify(products));
        res.send(`Product with id_product = ${id} has been removed`);
      } else {
        res.status(404).send(`Product with id_product = ${id} not found`);
      }
    } catch (error) {
      console.error(error);
      res.status(404).send("Error deleting the product");
    }
  } catch (err) {
    res.status(500).send("Error deleting the product");
  }
});

router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
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
  try {
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
      await writeFile("files/products.json", JSON.stringify(products));

      if (req.body.hasOwnProperty("id_product")) {
        res.send(`Product with id_product ${id} cannot be updated`);
      } else {
        res.send(`Product with id_product ${id} has been updated`);
      }
    } else {
      res.status(404).send(`Product with id_product ${id} not found`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the product");
  }
});
export default router;
