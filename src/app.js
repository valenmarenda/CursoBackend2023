import express from "express";
import { createRequire } from "module";
import url from "url";

const require = createRequire(import.meta.url);
const json = require("./files/Products.json");
const PORT = "8080";

const app = express();

app.listen(PORT, () => {
  console.log("servidor en " + PORT);
});

app.get("/", (req, res) => {
  res.send("products");
});

app.get("/productsTotal", (req, res) => {
  res.send(json);
});

app.get("/products", async (req, res) => {
  try {
    const queryParams = url.parse(req.url, true).query;
    const limit = queryParams.limit;
    const resultados = limit ? json.slice(0, limit) : json;
    res.json(resultados);
  } catch (err) {
    console.log(err);
  }
});

app.get("/products/:id_product", async (req, res) => {
    try{  const id_product = req.params.id_product;
        let product = json.find((p) => {
          return p.id_product == id_product.toString();
        });
        if (!product) {
          return res.send({
            error: "Producto no encontrado.",
          });
        }
        res.send({ product });} catch(err){
            console.log(err)
        }

});
