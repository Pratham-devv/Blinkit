import { Router} from "express";
import { addToCart, viewCart, removeFromCart, clearCart, mergeCart} from "../controllers/Cart.controller";
import { AuthMiddleware } from "../middlewares/Auth.middleware";

const router = Router();
router.get("/test", (req, res) => { res.send("Cart route is working"); });
router.post("/add", AuthMiddleware,  addToCart);
router.get("/", AuthMiddleware,viewCart);
router.delete("/remove",AuthMiddleware, removeFromCart);
router.delete("/clear",AuthMiddleware, clearCart);
router.post("/merge", AuthMiddleware, mergeCart)
export default router;  