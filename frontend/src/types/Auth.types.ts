import type { User } from "./User.types";

export interface AuthContextType{
    user: User|null;
    token: string| null;
    login: (userData: User, token:string)=> void;
    logout: ()=> void
}