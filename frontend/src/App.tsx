import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";
import { RootProvider } from "./Provider/RootProvider";
import Order from "./pages/Order";
import OrderStatus from "./pages/OrderStatus";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import SearchPage from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderDetails from "./pages/OrderDetails";


export default function App() {
  return(
    <RootProvider>
      <Router>
    <NavBar/>
    <Routes>
      
      <Route path= "/" element={<Home />}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path ='/account' element={<Profile/>}/>
      <Route path = '/cart' element={<ProtectedRoute>
          <Cart/>
      </ProtectedRoute>
        }/>
      <Route path = '/productDetails/:productId' element={<ProductDetails/>}/>
      <Route path = '/categories' element={<Categories/>}/>
      <Route path ='/order' element={<Order/>}/>
      <Route path ='/order/success/:orderId' element={<OrderStatus/>}/>
      <Route path="/search" element={<SearchPage/>}/>
      <Route path="/orderDetails/:orderId" element={
        <OrderDetails/>
      
      }/>

    </Routes>
    <Footer/>
      
   </Router>
    </RootProvider>
   
   
      


  );
}