import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateAccount } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/admin.css";

function AccountSettings() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newEmail: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: "" });
    setSuccess("");
  };

  const validate = () => {
    const errs = {};

    if (!form.currentPassword) {
      errs.currentPassword = "Current password is required";
    }

    const wantsEmailChange = form.newEmail.trim() !== "";
    const wantsPasswordChange = form.newPassword !== "";

    if (!wantsEmailChange && !wantsPasswordChange) {
      errs.general = "Enter a new email or new password to update something";
    }

    if (wantsEmailChange) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.newEmail.trim())) {
        errs.newEmail = "Enter a valid email address";
      }
    }

    if (wantsPasswordChange) {
      if (form.newPassword.length < 6) {
        errs.newPassword = "Password must be at least 6 characters";
      }
      if (form.newPassword !== form.confirmNewPassword) {
        errs.confirmNewPassword = "Passwords do not match";
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validate()) {
      if (fieldErrors.general) setError(fieldErrors.general);
      return;
    }

    setLoading(true);

    try {
      const payload = { currentPassword: form.currentPassword };
      if (form.newEmail.trim()) payload.newEmail = form.newEmail.trim();
      if (form.newPassword) payload.newPassword = form.newPassword;

      const res = await updateAccount(payload);

      if (res.data.emailChanged) {
        // Email changed — force re-login since the token/session is tied to the old identity.
        setSuccess("Email updated. Please log in again with your new email.");
        setTimeout(() => {
          logout();
          navigate("/admin/login");
        }, 1800);
      } else {
        setSuccess("Account updated successfully.");
        // Refresh local user info (e.g. in case name/role display depends on it)
        if (res.data.user) {
          login(res.data.user, localStorage.getItem("menvibe_token"));
        }
        setForm({
          currentPassword: "",
          newEmail: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Account Settings</h1>
      </div>

      <div className="product-form">
        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-success">{success}</p>}

        <p className="account-current-email">
          Signed in as <strong>{user?.email}</strong>
        </p>

        <div className="form-group">
          <label>Current Password *</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Required to make any change"
            className={fieldErrors.currentPassword ? "input-error" : ""}
          />
          {fieldErrors.currentPassword && (
            <span className="field-error">{fieldErrors.currentPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label>New Email (optional)</label>
          <input
            type="email"
            name="newEmail"
            value={form.newEmail}
            onChange={handleChange}
            placeholder="Leave blank to keep current email"
            className={fieldErrors.newEmail ? "input-error" : ""}
          />
          {fieldErrors.newEmail && (
            <span className="field-error">{fieldErrors.newEmail}</span>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>New Password (optional)</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className={fieldErrors.newPassword ? "input-error" : ""}
            />
            {fieldErrors.newPassword && (
              <span className="field-error">{fieldErrors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              className={fieldErrors.confirmNewPassword ? "input-error" : ""}
            />
            {fieldErrors.confirmNewPassword && (
              <span className="field-error">{fieldErrors.confirmNewPassword}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-gold" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button className="btn-outline" onClick={() => navigate("/admin/dashboard")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;