import express from "express";
import dotenv from "dotenv";
import { GetAllProducts, saveProducts } from "../controller/product.controller.js";

dotenv.config();
const router = express.Router();

router.post("/", saveProducts);
router.get("/getProduct", GetAllProducts);
export default router;