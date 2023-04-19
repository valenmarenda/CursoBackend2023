const socket = io();

socket.emit("message", "Nuevo ingreso");

const productList = document.getElementById("product-list");
const addProductForm = document.getElementById("add-product-form");
const product = document.getElementById("product");

addProductForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = addProductForm.title.value;
  const description = addProductForm.description.value;
  const code = addProductForm.code.value;
  const price = addProductForm.price.value;
  const status = addProductForm.status.checked;
  const stock = addProductForm.stock.value;
  const category = addProductForm.category.value;
  const thumbnails = addProductForm.thumbnails.value.split(",");

  socket.emit("add", {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  });

  addProductForm.reset();
});

socket.on("log", (data) => {
  let logs = "";

  data.logs.forEach((log) => {
    logs += `
    <h3> ${log.mesage.title}</h3>
    <p>${log.mesage.description}</p>
    <p>Precio: ${log.mesage.price}</p>
    <p>Stock:${log.mesage.stock}</p> <br/>`
  });

  product.innerHTML = logs;
});

socket.on("datos-recibidos", (datos) => {
  console.log("Datos recibidos:", datos);
});
