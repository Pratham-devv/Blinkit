import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/hooks/Auth.Hook";
import type { JSX } from "react";


const ProtectedRoute = ({children}:{children: JSX.Element}) => {
    const {user} = useAuth();
    const location = useLocation();

    if(!user){
        return (
            <Navigate to="/login"
            state={{from: location.pathname}}
        replace/>
    );
}
            
  return children;
};

export default ProtectedRoute;
