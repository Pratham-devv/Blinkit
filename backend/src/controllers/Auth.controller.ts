import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { AuthiRequest } from "../middlewares/Auth.middleware";
import bcrypt from "bcrypt";
import {
  signUpSchema,
  signInSchema,
  verifyOtpSchema,
  updateProfileSchema
} from "../validations/auth.validation";
import { sendOtpMail } from "../utils/mailer";

// Generate numeric six-digit OTP
const createOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const signUp = async (req: Request, res: Response) => {
  try {
    const { error } = signUpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: "Validation error", });

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already in use" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    return res.status(201).json({
      message: "Account created",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { error } = signInSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

     if (user.otp?.expiresAt) {
      const now = Date.now();

      // When OTP was originally created:
      const otpCreatedAt = new Date(user.otp.expiresAt).getTime() - (5 * 60 * 1000);

      const timeSinceLastOtp = now - otpCreatedAt;

      if (timeSinceLastOtp < 60 * 1000) {
        return res.status(429).json({
          message: "Please wait at least 1 minute before requesting another OTP."
        });
      }
    }

    const otp = createOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = {
      code: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    };

    await user.save();


    // TODO → SEND via email or SMS
    try {
  await sendOtpMail(email, otp);
} catch (err) {
  console.error("OTP EMAIL ERROR:", err);
  throw new Error("Failed to send OTP");
}
    return res.json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateProfile = async (req: AuthiRequest, res: Response) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({ message: "OTP not generated" });
    }

    if (!user.otp?.expiresAt || user.otp.expiresAt < new Date()) {
      user.otp = {
        code: null, expiresAt: null
      };
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    const validOtp = await bcrypt.compare(otp, user.otp.code);
    if (!validOtp) return res.status(400).json({ message: "Invalid OTP" });

    // Clear OTP
    user.otp = {
        code: null, expiresAt: null
    };
    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteProfile = async (req: AuthiRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.user?._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
