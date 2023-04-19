import express from "express";
import handlebars from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import __dirname from "./utils.js";
import viewRouter from "./routes/views.routes.js";
const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const server = app.listen(PORT, ()=>{
  console.log('Servidor funcionando en el puerto: ' + PORT);
})
//const httpServer = createServer(app).listen(PORT);
const io = new Server(server);

app.use("/", viewRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

const logs = [];
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("add", (data) => {
    logs.push({ mesage: data });
    io.emit("log", { logs });
  });
});
