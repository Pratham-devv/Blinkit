import { Router} from "express";
import { addToCart, viewCart, removeFromCart, clearCart, mergeCart, removeItemCompletely} from "../controllers/Cart.controller";
import { AuthMiddleware } from "../middlewares/Auth.middleware";

const router = Router();
router.post("/add", AuthMiddleware,  addToCart);
router.get("/", AuthMiddleware,viewCart);
router.delete("/remove",AuthMiddleware, removeFromCart);
router.delete("/clear",AuthMiddleware, clearCart);
router.post("/merge", AuthMiddleware, mergeCart);
router.delete("/clearItem",AuthMiddleware, removeItemCompletely);
export default router;  