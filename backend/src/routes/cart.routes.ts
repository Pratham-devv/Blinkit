import { Router} from "express";
import { addToCart, viewCart, removeFromCart, clearCart } from "../controllers/Cart.controller";

const router = Router();
router.get("/test", (req, res) => { res.send("Cart route is working"); });
router.post("/cart",  addToCart);
router.get("/cart", viewCart);
router.delete("/cart", removeFromCart);
router.delete("/cart/clear", clearCart);
export default router;