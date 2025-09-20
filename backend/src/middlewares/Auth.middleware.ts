import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthiRequest extends Request {
    user?: string | jwt.JwtPayload;
}


export const AuthMiddleware = (req: AuthiRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1] as string;
    try {
        const secret = process.env.JWT_SECRET as string;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const decoded = jwt.verify(token , secret) as jwt.JwtPayload;
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error });
    }
    finally {
        next();
    }
};

export const AdminMiddleware = (req: AuthiRequest, res: Response, next: NextFunction) => {
    if (!req.user || typeof req.user === 'string' || (req.user).role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};



