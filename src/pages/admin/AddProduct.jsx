import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/api";
import "../../styles/admin.css";


function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    featured: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
  const { name, description, price, brand, category, stock } = form;

  if (!name || !description || !price || !brand || !category || !stock) {
    setError("Please fill in all required fields.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("brand", form.brand);
    formData.append("category", form.category);
    formData.append("stock", Number(form.stock));
    formData.append("featured", form.featured);

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    await createProduct(formData);

    navigate("/admin/products");
  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.message ||
      "Failed to create product."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Add Product</h1>
      </div>

      <div className="product-form">
        {error && <p className="admin-error">{error}</p>}

        <div className="form-grid">
          <div className="form-group">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Rolex Submariner" />
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input name="brand" value={form.brand} onChange={handleChange} placeholder="Rolex" />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="Luxury" />
          </div>
          <div className="form-group">
            <label>Price (PKR) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="150000" />
          </div>
          <div className="form-group">
            <label>Stock *</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="10" />
          </div>
          <div className="form-group form-checkbox">
            <label>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured product
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe this watch..."
          />
        </div>

        <div className="form-group">
          <label>Product Images</label>
          <input type="file" accept="image/*" multiple onChange={handleImages} />
          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt={`preview ${i + 1}`} className="img-preview" />
              ))}
            </div>
          )}
          
        </div>

        <div className="form-actions">
          <button className="btn-gold" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add Product"}
          </button>
          <button className="btn-outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;