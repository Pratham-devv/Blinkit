import { Router } from "express";
import { viewProduct,searchProducts, viewProductByCategory ,postManyProducts, viewAllProducts} from "../controllers/Product.controller";

const router = Router();
console.log("Product Routes initialized");

router.get("/test", (req,res)=>{res.send("Welcome to Products API")}) ; // test route
router.get("/", viewAllProducts); // view all products
router.get("/category", viewProductByCategory); // view products by category
router.get("/search", searchProducts); // search products by title
router.post("/bulk", postManyProducts); // add many products at once - only for testing purpose
router.get("/:id", viewProduct);  // view single product by id

export default router; 
