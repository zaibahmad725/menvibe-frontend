import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/api";
import "../../styles/admin.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    getProducts()
      .then((res) => setProducts(res.data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <div className="admin-loading">Loading products...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Products</h1>
        <Link to="/admin/add-product" className="btn-gold">+ Add Product</Link>
      </div>

      {products.length === 0 ? (
        <p className="admin-empty">No products found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.images?.[0] || "/placeholder.jpg"}
                    alt={p.name}
                    className="table-img"
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>PKR {p.price?.toLocaleString()}</td>
                <td>
                  <span className={p.stock > 0 ? "stock-ok" : "stock-out"}>
                    {p.stock}
                  </span>
                </td>
                <td className="table-actions">
                  <Link to={`/admin/edit-product/${p._id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(p._id, p.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProducts;