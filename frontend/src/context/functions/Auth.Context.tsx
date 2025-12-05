import { createContext, useEffect, useState } from "react";
import type { AuthContextType } from "../../types/Auth.types";
import type { User } from "../../types/User.types";
import api from "../../api/axiosInstance";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode})=>{
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    const [user, setUser] = useState<User|null>(storedUser ? JSON.parse(storedUser) : null);
    const [token, setToken] = useState<string|null>(localStorage.getItem('token')|| null);

    useEffect(()=>{
         if(token && user){
            getProfile();
         }}
         // eslint-disable-next-line react-hooks/exhaustive-deps
         ,[token]);

    const signIn = async (email: string, password: string)=>{
        try {
            // setUser({email} as User); 
            // setToken("tempToken");
            // localStorage.setItem("token", "tempToken");
            // localStorage.setItem("user", JSON.stringify({email})); 

            // Conntinue with actual API call

            const res = await api.post('/auth/signin', {email, password});
            
            console.log(res);
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user)); 
        } catch (error) {
            console.error("SignIn error:", error);
            throw error;
        }
    };
    const logout = ()=>{
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };
    const signUp = async (username: string, email: string, password: string)=>{
        try {
            const res = await api.post('/auth/signup', {username, email, password});
            setUser(res.data.user);
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user)); 
        } catch (error) {
            console.error("SignUp error:", error);
            throw error;
        } 
    };

const updateProfile = async (userData: Partial<User>) => {
    try {
        const res = await api.put("auth/profile/update", userData);

        const updatedUser = res.data.user;

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return { success: true, message: res.data.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Update failed",
        };
    }
};


    const getProfile = async ()=>{
        
    };

  


    

    return (
        <AuthContext.Provider value={{user, token, signIn, logout, signUp , updateProfile, getProfile}}>
            {children}
        </AuthContext.Provider>
    );
};
export {AuthContext};