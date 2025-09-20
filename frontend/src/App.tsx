import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import NavBar from "./components/NavBar";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";


export default function App() {
  return(
   <Router>
    <NavBar/>
    <Routes>
      
      <Route path= "/" element={<Home />}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path ='/account' element={<Profile/>}/>
      <Route path = '/cart' element={<Cart/>}/>
      <Route path = '/product' element={<Product/>}/>
      <Route path = '/products' element={<Products/>}/>

    </Routes>
    <Footer/>
      
   </Router>
   
      


  );
}