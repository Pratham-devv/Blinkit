import { Router } from "express";
import { signUp, signIn, deleteProfile, updateProfile, verifyOtp} from "../controllers/Auth.controller";

import { AuthMiddleware, rateLimiter } from "../middlewares/Auth.middleware";

const router = Router();
router.get("/test", (req, res) => { res.send("Auth route is working"); });
router.post("/signup", signUp);
router.post("/signin",rateLimiter, signIn);
router.put("/profile/update", AuthMiddleware, updateProfile);
router.delete("/profile", AuthMiddleware, deleteProfile);
router.post("/otp/verify", verifyOtp);

export default router;