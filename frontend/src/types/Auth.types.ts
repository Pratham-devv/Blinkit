import type { User } from "./User.types";

export interface AuthContextType{
    user: User|null;
    token: string| null;
    signIn: (email:string, password:string)=> Promise<void>;
    logout: ()=> void;
    signUp: (username:string, password:string, email:string)=> Promise<void>;
    updateProfile: (userData: Partial<User>)=> void; 
    getProfile: ()=> Promise<void>;
}