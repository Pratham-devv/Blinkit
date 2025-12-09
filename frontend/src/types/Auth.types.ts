import type { User } from "./User.types";

export interface AuthContextType{
    user: User|null;
    token: string| null;
    signIn: (email:string)=> Promise<{ success: boolean; message?: string }>;
    verifyOtp: (email:string, otp:string)=> Promise<{ success: boolean; message?: string }>;
    logout: ()=> void;
    signUp: (username:string, password:string, email:string)=> Promise<{ success: boolean; message?: string }>;
    updateProfile: (userData: Partial<User>)=> Promise<{ success: boolean; message?: string }>;
    loading?: boolean;
}