import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Orders from "./pages/admin/Orders";
import AccountSettings from "./pages/admin/AccountSettings";
import HeroSlides from "./pages/admin/HeroSlides";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import TrackOrder from "./pages/TrackOrder";
import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={<AdminRoute><Dashboard /></AdminRoute>}
          />
          <Route
            path="/admin/products"
            element={<AdminRoute><Products /></AdminRoute>}
          />
          <Route
            path="/admin/add-product"
            element={<AdminRoute><AddProduct /></AdminRoute>}
          />
          <Route
            path="/admin/edit-product/:id"
            element={<AdminRoute><EditProduct /></AdminRoute>}
          />
          <Route
            path="/admin/orders"
            element={<AdminRoute><Orders /></AdminRoute>}
          />
          <Route
            path="/admin/account"
            element={<AdminRoute><AccountSettings /></AdminRoute>}
          />
          <Route
            path="/admin/hero-slides"
            element={<AdminRoute><HeroSlides /></AdminRoute>}
          />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;