import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import __dirname from "./utils.js";
import viewRouter from "./routes/views.routes.js";
import sessionRouter from './routes/sessions.router.js'
import session from "express-session";
import MongoStore from "connect-mongo"
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import { config } from "./config/config.js";

const port = config.server.port;
const app = express();
console.log("CONFIG:", config.mongo.ttl)
const MONGO = config.mongo.url;
const connection = mongoose.connect(MONGO);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(session({
  store: new MongoStore({
      mongoUrl: MONGO,
      ttl:config.mongo.ttl
  }),
  secret:config.mongo.secret,
  resave:false,
  saveUninitialized:false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


const server = app.listen(port, () => {
  console.log("Server running on port: " + port);
});

const io = new Server(server);

app.use("/", viewRouter);
app.use('/api/sessions', sessionRouter)
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

/// CHAT
const Message = mongoose.model("Message", {
  user: String,
  message: String,
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

io.on("connection", (socket) => {
  console.log("cliente conectado");

  Message.find().then((messages) => {
    socket.emit("historial", messages);
  });

  socket.on("mensaje", (data) => {
    console.log(`Nuevo mensaje de ${data.user}: ${data.message}`);

    const message = new Message(data);
    message.save();
    io.emit("mensaje", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
