import fs from "fs";

export default class ManagerProducts {
  constructor() {
    this.products = [];
    this.path = "./files/Products.json";
  }
  //consulta todos los productos
  getProduct = async () => {
    let path = this.path;
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, "utf-8");
      const producs = JSON.parse(data);
      return producs;
    } else {
      return [];
    }
  };

  //crea productos
  addProduct = async (title, desc, price, thumbnail, code, stock) => {
    let path = this.path;
    const products = await this.getProduct();
    let id = 0;
    if (products.length === 0) {
      id = 1;
    } else {
      id = products.length + 1;
    }
    let evento = {
      title: title,
      desc: desc,
      price: price,
      thumbnail: thumbnail,
      code: code,
      id_product: id,
      stock: stock,
    };

    products.push(evento);
    await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));

    return products;
  };

  //obtener producto por id
  getProductById = async (id_product) => {
    const products = await this.getProduct();
    let product = products.find((id) => id.id_product === id_product);
    if (product) {
      return product;
    } else {
      return "Not found";
    }
  };

  //modificar producto
  updateProduct = async (id, obj) => {
    let path = this.path;
    const objetoNuevo = obj;
    const products = await this.getProduct();
    const producto = products.find((p) => p.id_product === id);
    if(producto){
      Object.assign(producto, objetoNuevo)
      await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"))
      return products;
    }else{
      return "Not found";
    }
  
  };

  //eliminar producto
  deleteProduct = async (id) => {
    let path = this.path;
    const products = await this.getProduct();
    if (products) {
      for (var i = 0; i < products.length; i++) {
        if (products[i].id_product === id) {
          products.splice(i, 1);
          break;
        }
      }
      await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
      return products;
    } else {
      return "Not found";
    }
  };
}

