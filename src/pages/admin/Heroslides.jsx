import { useEffect, useState } from "react";
import {
  getAllHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "../../services/api";
import { API_URL } from "../../config";
import "../../styles/admin.css";
import "../../styles/adminHeroSlides.css";

const EMPTY_FORM = {
  eyebrow: "",
  title: "",
  subtitle: "",
  accent: "",
  cta: "Shop Now",
  link: "/shop",
  active: true,
};

function AdminHeroSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // null = not editing, "new" = creating
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSlides = () => {
    setLoading(true);
    getAllHeroSlides()
      .then((res) => setSlides(res.data || []))
      .catch(() => setError("Failed to load slides."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSlides(); }, []);

  const resolveImg = (path) => (path?.startsWith("http") ? path : `${API_URL}${path}`);

  const startNew = () => {
    setEditingId("new");
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  const startEdit = (slide) => {
    setEditingId(slide._id);
    setForm({
      eyebrow: slide.eyebrow || "",
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      accent: slide.accent || "",
      cta: slide.cta || "Shop Now",
      link: slide.link || "/shop",
      active: slide.active,
    });
    setImageFile(null);
    setImagePreview(resolveImg(slide.image));
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (editingId === "new" && !imageFile) {
      setError("Please choose an image for this slide.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("eyebrow", form.eyebrow);
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle);
      fd.append("accent", form.accent);
      fd.append("cta", form.cta);
      fd.append("link", form.link);
      fd.append("active", form.active);
      if (imageFile) fd.append("image", imageFile);

      if (editingId === "new") {
        fd.append("order", slides.length);
        await createHeroSlide(fd);
      } else {
        await updateHeroSlide(editingId, fd);
      }

      cancelEdit();
      fetchSlides();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save slide.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slide) => {
    const fd = new FormData();
    fd.append("active", !slide.active);
    try {
      await updateHeroSlide(slide._id, fd);
      fetchSlides();
    } catch {
      alert("Failed to update slide status.");
    }
  };

  const handleMove = async (slide, direction) => {
    const sorted = [...slides].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s._id === slide._id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];

    try {
      const fdA = new FormData();
      fdA.append("order", b.order);
      const fdB = new FormData();
      fdB.append("order", a.order);

      await Promise.all([updateHeroSlide(a._id, fdA), updateHeroSlide(b._id, fdB)]);
      fetchSlides();
    } catch {
      alert("Failed to reorder slides.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteHeroSlide(deleteTarget._id);
      setDeleteTarget(null);
      fetchSlides();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Hero Slides</h1>
        {editingId === null && (
          <button className="btn-gold" onClick={startNew}>+ Add Slide</button>
        )}
      </div>

      {/* Add/Edit form */}
      {editingId !== null && (
        <div className="product-form hero-slide-form">
          <h2 className="hero-form-title">
            {editingId === "new" ? "New Slide" : "Edit Slide"}
          </h2>

          {error && <p className="admin-error">{error}</p>}

          <div className="hero-form-layout">
            {/* Image picker */}
            <div className="hero-image-picker">
              {imagePreview ? (
                <div className="hero-image-preview-wrap">
                  <img src={imagePreview} alt="Slide preview" className="hero-image-preview" />
                  <label className="hero-image-replace">
                    Change Image
                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                  </label>
                </div>
              ) : (
                <label className="hero-image-dropzone">
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                  <span className="dropzone-icon">🖼️</span>
                  <span className="dropzone-text">Click to upload slide image</span>
                  <span className="dropzone-hint">Recommended: 1400×900px or larger · max 8MB</span>
                </label>
              )}
            </div>

            {/* Text fields */}
            <div className="hero-fields">
              <div className="form-group">
                <label>Eyebrow (small label above title)</label>
                <input name="eyebrow" value={form.eyebrow} onChange={handleChange} placeholder="New Arrivals 2025" />
              </div>

              <div className="form-group">
                <label>Title *</label>
                <textarea
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  rows={2}
                  placeholder={"Precision\nCrafted"}
                />
                <span className="field-hint">Press Enter for a line break, like the preview shows.</span>
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Timepieces that define the modern gentleman." />
              </div>

              <div className="form-group">
                <label>Accent Text (small line above the button)</label>
                <input name="accent" value={form.accent} onChange={handleChange} placeholder="Rolex · Omega · Tissot" />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Button Text</label>
                  <input name="cta" value={form.cta} onChange={handleChange} placeholder="Shop Now" />
                </div>
                <div className="form-group">
                  <label>Button Link</label>
                  <input name="link" value={form.link} onChange={handleChange} placeholder="/shop" />
                </div>
              </div>

              <div className="form-group form-checkbox">
                <label>
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                  Active (visible on the live site)
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Slide"}
            </button>
            <button className="btn-outline" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Slide list */}
      {loading ? (
        <div className="admin-loading">Loading slides...</div>
      ) : sortedSlides.length === 0 && editingId === null ? (
        <div className="admin-empty">
          <p>No hero slides yet. The homepage is showing a default fallback slide.</p>
          <button className="btn-gold" onClick={startNew} style={{ marginTop: "1rem" }}>
            + Add Your First Slide
          </button>
        </div>
      ) : (
        <div className="hero-slides-list">
          {sortedSlides.map((slide, i) => (
            <div key={slide._id} className={`hero-slide-card ${!slide.active ? "inactive" : ""}`}>
              <img src={resolveImg(slide.image)} alt={slide.title} className="hero-slide-thumb" />

              <div className="hero-slide-info">
                <div className="hero-slide-info-top">
                  {slide.eyebrow && <span className="hero-slide-eyebrow">{slide.eyebrow}</span>}
                  {!slide.active && <span className="hero-slide-inactive-tag">Hidden</span>}
                </div>
                <p className="hero-slide-title-preview">{slide.title.replace(/\n/g, " ")}</p>
                <p className="hero-slide-subtitle-preview">{slide.subtitle}</p>
              </div>

              <div className="hero-slide-actions">
                <div className="hero-reorder-btns">
                  <button
                    className="reorder-btn"
                    onClick={() => handleMove(slide, "up")}
                    disabled={i === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="reorder-btn"
                    onClick={() => handleMove(slide, "down")}
                    disabled={i === sortedSlides.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={slide.active}
                    onChange={() => handleToggleActive(slide)}
                  />
                  <span className="toggle-slider" />
                </label>

                <button className="btn-edit" onClick={() => startEdit(slide)}>Edit</button>
                <button className="btn-delete" onClick={() => setDeleteTarget(slide)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Delete this slide?</h3>
            <p className="modal-text">
              <strong>{deleteTarget.title.replace(/\n/g, " ")}</strong> will be permanently removed from the homepage slider. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete Slide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHeroSlides;