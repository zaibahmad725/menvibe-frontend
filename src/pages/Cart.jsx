import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {  API_URL } from "../config";
import "../styles/cart.css";

function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any watches yet.</p>
        <Link to="/shop" className="btn-gold">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.images?.[0] ? `${API_URL}${item.images[0]}` : "/placeholder.jpg"}
                alt={item.name}
                className="cart-item-img"
              />

              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-brand">{item.brand}</p>
                <p className="cart-item-price">PKR {item.price.toLocaleString()}</p>
              </div>

              <div className="cart-item-controls">
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item._id)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item._id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>

              <div className="cart-item-subtotal">
                PKR {(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>PKR {cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>PKR {cartTotal.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="btn-checkout">
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="btn-continue">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;