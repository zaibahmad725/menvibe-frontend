import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../../services/api";
import "../../styles/admin.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [keptImages, setKeptImages] = useState([]); // existing images kept (from server)
  const [imageFiles, setImageFiles] = useState([]); // new files to upload
  const [imagePreviews, setImagePreviews] = useState([]); // local preview URLs for new files
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProduct(id).then((res) => {
      const p = res.data;
      setForm({
        name: p.name || "",
        description: p.description || "",
        price: p.price || "",
        brand: p.brand || "",
        category: p.category || "",
        stock: p.stock || "",
        featured: p.featured || false,
        images: p.images || [],
      });
      setKeptImages(p.images || []); // <-- was missing
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // 👇 this was missing entirely, causing the ReferenceError
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setImageFiles((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleSubmit = async () => {
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

      // send remaining (kept) existing images
      formData.append("existingImages", JSON.stringify(keptImages));

      // new uploads
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      await updateProduct(id, formData);

      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="admin-loading">Loading product...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Edit Product</h1>
      </div>

      <div className="product-form">
        {error && <p className="admin-error">{error}</p>}

        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input name="category" value={form.category} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Price (PKR)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} />
          </div>
          <div className="form-group form-checkbox">
            <label>
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured product
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </div>

        <div className="form-group">
          <label>Images</label>
          <input type="file" accept="image/*" multiple onChange={handleImages} />

          {/* Existing images kept on the product */}
          {keptImages.length > 0 && (
            <div className="image-previews">
              {keptImages.map((img, i) => (
                <div key={`kept-${i}`} className="image-box">
                  <img
                    src={`http://localhost:5000${img}`}
                    alt="product"
                    className="img-preview"
                  />
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => {
                      setKeptImages((prev) => prev.filter((_, index) => index !== i));
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New images selected but not yet uploaded */}
          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((src, i) => (
                <div key={`new-${i}`} className="image-box">
                  <img src={src} alt="new upload" className="img-preview" />
                  <button
                    type="button"
                    className="remove-img-btn"
                    onClick={() => {
                      setImagePreviews((prev) => prev.filter((_, index) => index !== i));
                      setImageFiles((prev) => prev.filter((_, index) => index !== i));
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button className="btn-gold" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button className="btn-outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;