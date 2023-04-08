import ManagerProducts from "./manager/productManager.js";
const manager = new ManagerProducts();

const env = async () => {
  //let usuarios = await manager.addProduct("pc", "airpods 4", 9900, "http//airpod", 30, 50)

  //let usuarios = await manager.getProductById(1)

  //let usuarios = await manager.deleteProduct(1)

  let usuarios = await manager. updateProduct(3, {
    title: "hjvjhvj",
  });
  console.log(usuarios);
};

env();
