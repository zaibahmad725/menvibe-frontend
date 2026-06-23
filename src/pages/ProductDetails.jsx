import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";
import "../styles/product.css";

const WHATSAPP_NUMBER = "923497035121"; 

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    getProduct(id)
      .then((res) => { setProduct(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNowDirect = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    navigate("/checkout");
  };

  const handleBuyNow = () => {
    const text = encodeURIComponent(
      `🛍 *Order Inquiry — MenVibe*\n\n` +
      `I'm interested in:\n` +
      `• *${product.name}* (${product.brand})\n` +
      `• Qty: ${qty}\n` +
      `• Price: PKR ${(product.price * qty).toLocaleString()}\n\n` +
      `Please confirm availability and delivery details. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="not-found">Product not found.</div>;

  return (
    <div className="product-details-page">
      {/* Images */}
      <div className="pd-images">
        <img
          src={
  product.images?.[activeImg]
    ? product.images[activeImg].startsWith("http")
      ? product.images[activeImg]
      : `${API_URL}${product.images[activeImg]}`
    : "/placeholder.jpg"
}
          alt={product.name}
          className="pd-main-img"
        />
        {product.images?.length > 1 && (
          <div className="pd-thumbnails">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={
  img.startsWith("http")
    ? img
    : `${API_URL}${img}`
}
                alt={`${product.name} ${i + 1}`}
                className={`pd-thumb ${i === activeImg ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pd-info">
        <p className="pd-brand">{product.brand}</p>
        <h1 className="pd-name">{product.name}</h1>
        <p className="pd-price">PKR {(product.price * qty).toLocaleString()}</p>

        <div className="pd-meta">
          <span className="pd-tag">{product.category}</span>
          <span className={`pd-stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <p className="pd-description">{product.description}</p>

        {/* Qty selector */}
        <div className="pd-qty">
          <span className="pd-qty-label">Quantity</span>
          <div className="qty-controls">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="qty-value">{qty}</span>
            <button className="qty-btn" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>
        </div>

        <div className="pd-actions">
          <button
            className="btn-buy-now"
            onClick={handleBuyNowDirect}
            disabled={product.stock === 0}
          >
            Buy Now
          </button>
          <div className="pd-actions-row">
            <button
              className={`btn-add-cart ${added ? "btn-added" : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <button
              className="btn-buy-whatsapp"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <svg viewBox="0 0 32 32" fill="currentColor" width="17" height="17">
                <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.66 4.76 1.8 6.76L2 30l7.44-1.78A13.93 13.93 0 0016 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm7.1 19.44c-.3.84-1.74 1.6-2.4 1.7-.64.1-1.44.14-2.32-.14-.54-.16-1.22-.38-2.1-.74-3.7-1.6-6.12-5.34-6.3-5.6-.18-.24-1.44-1.92-1.44-3.66 0-1.74.9-2.6 1.22-2.96.3-.34.66-.42.88-.42l.64.01c.2 0 .48-.08.74.56.3.7 1.02 2.44 1.1 2.62.1.18.16.4.04.64-.12.24-.18.38-.36.58-.18.2-.38.44-.54.6-.18.18-.36.38-.16.74.2.36.9 1.48 1.94 2.4 1.34 1.18 2.46 1.56 2.82 1.72.36.18.58.16.8-.1.22-.26.9-1.06 1.14-1.42.24-.36.48-.3.8-.18.32.12 2.04.96 2.4 1.14.34.18.58.26.66.42.1.14.1.82-.2 1.64z"/>
              </svg>
              WhatsApp
            </button>
          </div>
        </div>

        <div className="pd-trust">
          <span> Authentic</span>
          <span> Cash on Delivery</span>
          <span> 7-Day Return</span>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;