import { useState } from "react";
import { useAuth } from "../context/hooks/Auth.Hook";
import {  useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn( email, password );
          const redirectTo = location.state?.from || '/';
          navigate(redirectTo, { replace: true });

        }}
      >
        Sign In
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
