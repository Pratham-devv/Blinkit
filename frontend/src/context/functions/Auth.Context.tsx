import { createContext, useEffect, useState } from "react";
import type { AuthContextType } from "../../types/Auth.types";
import type { User } from "../../types/User.types";
import api from "../../api/axiosInstance";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode})=>{
    const [user, setUser] = useState<User|null>(
    localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")! as string): null
    );
    const [token, setToken] = useState<string|null>(localStorage.getItem('token'));

    useEffect(()=>{
         if(token && !user){
            getProfile();
         }}
         // eslint-disable-next-line react-hooks/exhaustive-deps
         ,[token]);

    const signIn = async (email: string, password: string)=>{
        try {
            setUser({email} as User); 
            setToken("tempToken");
            localStorage.setItem("token", "tempToken");
            localStorage.setItem("user", JSON.stringify({email})); 

            // Conntinue with actual API call

            const res = await api.post('/auth/signin', {email, password});
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
    const updateProfile = (userData: Partial<User>)=>{
        if(!user) return;
        const updatedUser = {...user, ...userData};
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const getProfile = async ()=>{
        if(!token) return;
        try {
            const res = await api.get('/auth/profile');
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data)); 
        } catch (error) {
            console.error("GetProfile error:", error);
            logout();
        }
    };

  


    

    return (
        <AuthContext.Provider value={{user, token, signIn, logout, signUp , updateProfile, getProfile}}>
            {children}
        </AuthContext.Provider>
    );
};
export {AuthContext};