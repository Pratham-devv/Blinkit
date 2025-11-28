import { Request, Response } from "express";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { AuthiRequest } from "../middlewares/Auth.middleware";


export const signUp = async (req: Request, res: Response) => { 
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use" });
        }
        const user = new User({ username, email, password });
        await user.save();
 
        const token = generateToken(user._id.toString(), user.role);

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        } 
        const token = generateToken(user._id.toString(), user.role);
        res.status(200).json({ token ,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const signOut = async (req: Request, res: Response) => {
    // Since JWT is stateless, sign out can be handled on the client side by deleting the token.
    res.status(200).json({ message: "Sign out successful on client side by deleting the token" });
};

export const getProfile = async (req: AuthiRequest, res: Response) => {
    try {
        res.json(req.user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  } 
}; 

export const updateProfile = async (req: AuthiRequest, res: Response) => {
    try {
        const userId = (req.user as { _id: string })?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { username, email, password } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteProfile = async (req: AuthiRequest, res: Response) => {
    try {
        const userId = req.user?._id.toString();
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



