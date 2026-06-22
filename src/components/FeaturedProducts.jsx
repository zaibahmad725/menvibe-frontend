import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "./ProductCard";
import "../styles/featured.css";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => {
        const all = res.data.products || [];
        // Show featured first, fallback to first 8
        const featured = all.filter((p) => p.featured);
        setProducts(featured.length >= 4 ? featured.slice(0, 8) : all.slice(0, 8));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="featured-section">
      <div className="featured-header">
        <p className="featured-eyebrow">Handpicked for You</p>
        <h2 className="featured-title">Featured Timepieces</h2>
        <p className="featured-sub">Curated selection of the finest watches in our collection</p>
      </div>

      {loading ? (
        <div className="featured-loading">Loading collection...</div>
      ) : (
        <>
          <div className="featured-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="featured-footer">
            <Link to="/shop" className="btn-view-all">
              View Full Collection →
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default FeaturedProducts;