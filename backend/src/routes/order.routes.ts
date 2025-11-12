import { Router } from "express";
import { cancelOrder, viewOrderDetails, viewOrders , placeOrder} from "../controllers/Order.controller";
import { AuthMiddleware } from "../middlewares/Auth.middleware";


const router = Router();

router.get("/",AuthMiddleware ,viewOrders);
router.get("/:id",AuthMiddleware ,viewOrderDetails);
router.post("/placeOrder",AuthMiddleware ,placeOrder);
router.delete("/:id", AuthMiddleware, cancelOrder);


export default router;