import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { User, IUser  } from "../models/user.model";
import rateLimit from "express-rate-limit";

dotenv.config();

export interface AuthiRequest extends Request {
  user?: any;
}

export const AuthMiddleware = async (
  req: AuthiRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1] as string;
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    } 

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};

export const rateLimiter = rateLimit({
  windowMs:  60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 requests per windowMs
  message: "Too many requests from this IP, please try again after a minute"
});

export const AdminMiddleware = (
  req: AuthiRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || typeof req.user === "string" || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};
