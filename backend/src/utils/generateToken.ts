import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string) => {
    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({id, role}, secret, { expiresIn: '7d' });
};
