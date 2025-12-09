import { createContext,  useState } from "react";
import type { AuthContextType } from "../../types/Auth.types";
import type { User } from "../../types/User.types";
import api from "../../api/axiosInstance";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode})=>{
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    const [user, setUser] = useState<User|null>(storedUser ? JSON.parse(storedUser) : null);
    const [token, setToken] = useState<string|null>(localStorage.getItem('token')|| null);
    const [loading, setLoading] = useState(false);
    const signIn = async (email: string)=>{
        setLoading(true);
        try {
           
            const res = await api.post('/auth/signin', {email});
            setLoading(false);
             return { success: true, message: res.data?.message || "OTP sent" };           
        } catch (error) {
            setLoading(false);
            console.error("SignIn error:", error);
            throw error;
        }
    };

    const verifyOtp = async (email: string, otp: string) => {
        setLoading(true);
        try {
      const res = await api.post("/auth/otp/verify", { email, otp });
      const token = res.data?.token;
      const returnedUser = res.data?.user;
      if (token && returnedUser) {
        localStorage.setItem("token", token);
        setToken(token);
        setUser(returnedUser as User);
        localStorage.setItem("user", JSON.stringify(returnedUser));
        setLoading(false);
        return { success: true, message: res.data?.message || "Logged in" };
      } else {
        return { success: false, message: "Invalid server response" };
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to verify OTP",
      };
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
      const res = await api.post("/auth/signup", { username, email, password });
      const token = res.data?.token;
      const returnedUser = res.data?.user;
      if (token && returnedUser) {
        localStorage.setItem("token", token);
        setToken(token);
        setUser(returnedUser as User);
        localStorage.setItem("user", JSON.stringify(returnedUser));
        setLoading(false);
        return { success: true, message: res.data?.message || "Account created" };
      } else {
        setLoading(false);
        return { success: false, message: "Invalid server response" };
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || "Sign up failed" };
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

  


    

    return (
        <AuthContext.Provider value={{user, token, signIn, logout, signUp , updateProfile, verifyOtp, loading}}>
            {children}
        </AuthContext.Provider>
    );
};
export {AuthContext};