import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAdminOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        MenVibe
      </Link>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/track-order">Track Order</Link></li>
      </ul>

      <div className="navbar-right">
        <Link to="/cart" className="cart-link">
          🛒
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {isAdmin ? (
          <div className="admin-dropdown">
            <button
              className="admin-btn"
              onClick={() => setAdminOpen((o) => !o)}
            >
              Admin ▾
            </button>
            {adminOpen && (
              <div className="dropdown-menu">
                <Link to="/admin/dashboard" onClick={() => setAdminOpen(false)}>Dashboard</Link>
                <Link to="/admin/products" onClick={() => setAdminOpen(false)}>Products</Link>
                <Link to="/admin/add-product" onClick={() => setAdminOpen(false)}>Add Product</Link>
                <Link to="/admin/orders" onClick={() => setAdminOpen(false)}>Orders</Link>
                <Link to="/admin/hero-slides" onClick={() => setAdminOpen(false)}>Hero Slides</Link>
                <Link to="/admin/account" onClick={() => setAdminOpen(false)}>Account Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/admin/login" className="login-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;