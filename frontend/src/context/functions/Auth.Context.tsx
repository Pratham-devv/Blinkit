import { createContext, useState } from "react";
import type { AuthContextType } from "../../types/Auth.types";
import type { User } from "../../types/User.types";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode})=>{
    const [user, setUser] = useState<User|null>(null);
    const [token, setToken] = useState<string|null>(null);

    const login = (userData: User, token:string)=>{
        setUser(userData);
        setToken(token);
        localStorage.setItem('authToken', token);
    };

    const logout = ()=>{
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
    };
    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
export {AuthContext};