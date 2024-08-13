import express from "express";
import userController from "./controllers/users.js";
import { validateToken } from "./middleware/validateJwt.js";

console.log("Aqui");
const route = express.Router();

route.post("/user", userController.userRegistration);
route.post("/login", userController.login);

route.use(validateToken);

export default route; // Exportação usando ES Modules
