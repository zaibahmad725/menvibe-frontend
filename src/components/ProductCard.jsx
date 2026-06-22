import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";
import "../styles/productcard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-card-img-wrap" onClick={() => navigate(`/product/${product._id}`)}>
        <img
          src={
    product.images?.[0]
    ? `${API_URL}${product.images[0]}`
    : "https://via.placeholder.com/300x300?text=Watch"
}
          alt={product.name}
          className="product-card-img"
        />
        {product.featured && <span className="product-badge">Featured</span>}
        {product.stock === 0 && <span className="product-badge badge-out">Sold Out</span>}
      </div>

      <div className="product-card-body">
        <p className="product-card-brand">{product.brand}</p>
        <h3 className="product-card-name" onClick={() => navigate(`/product/${product._id}`)}>
          {product.name}
        </h3>
        <p className="product-card-price">PKR {product.price?.toLocaleString()}</p>

        <div className="product-card-actions">
          <button
            className="btn-card-cart"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Sold Out" : "Add to Cart"}
          </button>
          <button
            className="btn-card-view"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;