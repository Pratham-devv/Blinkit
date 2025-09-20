import { Router } from "express";
import { viewProduct,searchProducts, viewProductByCategory } from "../controllers/Product.controller";

const router = Router();

router.get("/products/:id", viewProduct);  // view single product by id
router.get("/products", viewProductByCategory); // view products by category
router.get("/products/search", searchProducts); // search products by title

export default router;