import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
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
  return (
    <RootProvider>
      <Router>
        <div className="flex min-h-screen">
          {/* Footer/Sidebar Navigation */}
          <Footer />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col md:ml-20 lg:ml-24">
            {/* NavBar */}
           

            {/* Page Content with bottom padding for mobile footer */}
            <main className="flex-1 pb-16 md:pb-0">
              <Routes>
                
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/account" element={<Profile />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route path="/productDetails/:productId" element={<ProductDetails />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/order" element={<Order />} />
                <Route path="/order/success/:orderId" element={<OrderStatus />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/orderDetails/:orderId" element={<OrderDetails />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </RootProvider>
  );
}