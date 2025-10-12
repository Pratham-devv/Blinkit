import { Router } from "express";
import { signUp, signIn, deleteProfile, getProfile, updateProfile} from "../controllers/Auth.controller";

import { AuthMiddleware } from "../middlewares/Auth.middleware";

const router = Router();
router.get("/test", (req, res) => { res.send("Auth route is working"); });
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile", AuthMiddleware, getProfile);
router.put("/profile", AuthMiddleware, updateProfile);
router.delete("/profile", AuthMiddleware, deleteProfile);

export default router;