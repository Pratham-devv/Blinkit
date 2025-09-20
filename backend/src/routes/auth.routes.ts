import { Router } from "express";
import { signUp, signIn, deleteProfile, getProfile, updateProfile} from "../controllers/Auth.controller";

import { AuthMiddleware } from "../middlewares/Auth.middleware";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile", AuthMiddleware, getProfile);
router.put("/profile", AuthMiddleware, updateProfile);
router.delete("/profile", AuthMiddleware, deleteProfile);

export default router;