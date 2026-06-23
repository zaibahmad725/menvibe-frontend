import { useState, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../services/api";
import { API_URL } from "../config";
import "../styles/checkout.css";

// ---- Payment accounts configuration ----
// Add/remove accounts freely. Each method can have multiple accounts —
// the customer picks one and sees only that account's details.
const PAYMENT_ACCOUNTS = {
  BankTransfer: [
    {
      id: "meezan-main",
      label: "MCB Islamic",
      fields: [
        { label: "Bank Name", value: "MCB Islamic" },
        { label: "Account Title", value: "Adil Arif" },
        { label: "Account Number", value: "0641005674310001" },
        { label: "IBAN", value: "not yet available" },
      ],
    },
    {
      id: "hbl-secondary",
      label: "HBL ",
      fields: [
        { label: "Bank Name", value: "Habib Bank Limited (HBL)" },
        { label: "Account Title", value: "Adil Arif" },
        { label: "Account Number", value: "24447107566103" },
        { label: "IBAN", value: "PK00 HABB 0009 8765 4321 098" },
      ],
    },
  ],


  NayaPay: [
    {
      id: "nayapay-main",
      label: "NayaPay",
      fields: [
        { label: "Account Title", value: "Adil Arif" },
        { label: "NayaPay Number", value: "03134799968" },
      ],
    },
  ],
};

const PAYMENT_METHODS = [
  { id: "COD", icon: "💵", name: "Cash on Delivery", desc: "Pay when your order arrives" },
  { id: "BankTransfer", icon: "🏦", name: "Bank Transfer", desc: "Pay via direct bank transfer" },
  { id: "NayaPay", icon: "📲", name: "NayaPay", desc: "Pay via NayaPay mobile account" },
];

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", address: "" });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const requiresPayment = paymentMethod !== "COD";
  const accountOptions = PAYMENT_ACCOUNTS[paymentMethod] || [];
  const selectedAccount = useMemo(
    () => accountOptions.find((a) => a.id === selectedAccountId) || accountOptions[0] || null,
    [accountOptions, selectedAccountId]
  );

  if (cart.length === 0 && !placedOrder) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleMethodChange = (methodId) => {
    setPaymentMethod(methodId);
    const firstAccount = PAYMENT_ACCOUNTS[methodId]?.[0];
    setSelectedAccountId(firstAccount ? firstAccount.id : null);
    setErrors({ ...errors, screenshot: "" });
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, screenshot: "Please upload an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, screenshot: "Image must be under 5MB." });
      return;
    }

    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setErrors({ ...errors, screenshot: "" });
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (requiresPayment && !screenshot) {
      e.screenshot = "Please upload your payment screenshot";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const orderItems = cart.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.images?.[0] || "",
        quantity: item.qty,
        price: item.price,
      }));

      const shippingAddress = {
        fullName: form.name,
        email: form.email.trim(),
        phone: form.phone,
        city: form.city,
        address: form.address,
      };

      let res;

      if (requiresPayment) {
        const fd = new FormData();
        fd.append("orderItems", JSON.stringify(orderItems));
        fd.append("shippingAddress", JSON.stringify(shippingAddress));
        fd.append("totalPrice", cartTotal);
        fd.append("paymentMethod", paymentMethod);
        fd.append("paymentAccountLabel", selectedAccount?.label || "");
        fd.append("screenshot", screenshot);
        res = await placeOrder(fd, true);
      } else {
        res = await placeOrder({
          orderItems,
          shippingAddress,
          totalPrice: cartTotal,
          paymentMethod: "COD",
        });
      }

      setPlacedOrder(res.data);
      clearCart();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Success state ----
  if (placedOrder) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully</h1>
          <p className="success-order-number">
            Order Number: <strong>{placedOrder.orderNumber}</strong>
          </p>
          <p className="success-message">
            {placedOrder.paymentMethod !== "COD"
              ? "We've received your payment screenshot. Our team will verify it and confirm your order shortly."
              : "Your order will be confirmed shortly. Pay in cash when it arrives at your doorstep."}
          </p>
          <p className="success-email-note">
            📧 A confirmation has been sent to <strong>{placedOrder.shippingAddress?.email}</strong>
          </p>
          <div className="success-actions">
            <Link to={`/track-order?order=${placedOrder.orderNumber}`} className="btn-gold">
              Track This Order
            </Link>
            <Link to="/shop" className="btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        {/* Left: form */}
        <div className="checkout-form">
          <h2>Shipping Details</h2>

          {submitError && <p className="checkout-error">{submitError}</p>}

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Ahmed Khan" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ahmed@example.com" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 0000000" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>City *</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Lahore" />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Address *</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Street, House No." />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>
          </div>

          {/* Payment method */}
          <h2 className="payment-heading">Payment Method</h2>

          <div className="payment-options">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`payment-option ${paymentMethod === m.id ? "active" : ""}`}
                onClick={() => handleMethodChange(m.id)}
              >
                <span className="payment-icon">{m.icon}</span>
                <span className="payment-label">
                  <span className="payment-name">{m.name}</span>
                  <span className="payment-desc">{m.desc}</span>
                </span>
                <span className="payment-radio" />
              </button>
            ))}
          </div>

          {/* Account selector + details + upload, shown for any non-COD method */}
          {requiresPayment && (
            <div className="bank-transfer-panel">
              {accountOptions.length > 1 && (
                <>
                  <p className="bank-panel-title">Choose an account</p>
                  <div className="account-selector">
                    {accountOptions.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        className={`account-option ${selectedAccount?.id === acc.id ? "active" : ""}`}
                        onClick={() => setSelectedAccountId(acc.id)}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <p className="bank-panel-title">
                {accountOptions.length > 1 ? "Transfer to this account" : `Pay via ${selectedAccount?.label || paymentMethod}`}
              </p>

              {selectedAccount && (
                <div className="bank-details">
                  {selectedAccount.fields.map((f) => (
                    <div key={f.label} className="bank-row">
                      <span>{f.label}</span>
                      <strong>{f.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              <p className="bank-panel-sub">
                After sending payment, upload a screenshot of your receipt below.
              </p>

              {!screenshotPreview ? (
                <label className="screenshot-dropzone">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    hidden
                  />
                  <span className="dropzone-icon">📎</span>
                  <span className="dropzone-text">Click to upload payment screenshot</span>
                  <span className="dropzone-hint">JPG, PNG or WEBP — max 5MB</span>
                </label>
              ) : (
                <div className="screenshot-preview">
                  <img src={screenshotPreview} alt="Payment screenshot" />
                  <button type="button" className="remove-screenshot" onClick={removeScreenshot}>
                    Remove
                  </button>
                </div>
              )}
              {errors.screenshot && <span className="field-error">{errors.screenshot}</span>}
            </div>
          )}
        </div>

        {/* Right: summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div key={item._id} className="checkout-item">
              <img src={
  item.images?.[0]
    ? item.images[0].startsWith("http")
      ? item.images[0]
      : `${API_URL}${item.images[0]}`
    : "/placeholder.jpg"
} />
              <div>
                <p className="ci-name">{item.name}</p>
                <p className="ci-brand">{item.brand}</p>
                <p className="ci-qty">Qty: {item.qty}</p>
              </div>
              <p className="ci-price">PKR {(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}

          <div className="checkout-divider" />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>PKR {cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>

          <div className="checkout-divider" />

          <div className="checkout-total">
            <span>Total</span>
            <span>PKR {cartTotal.toLocaleString()}</span>
          </div>

          <button className="btn-place-order" onClick={handleSubmit} disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <p className="checkout-secure-note">
            🔒 Your information is safe and only used to process this order.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;