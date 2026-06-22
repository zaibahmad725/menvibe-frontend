import { useEffect, useState, useCallback } from "react";
import { getAllOrders, updateOrderStatus, verifyPayment } from "../../services/api";
import "../../styles/adminOrder.css";

const STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
const API_ORIGIN = "http://localhost:5000"; // backend host, for resolving /uploads paths

const PAYMENT_METHOD_DISPLAY = {
  COD: { label: "COD", fullLabel: "Cash on Delivery", className: "tag-cod" },
  BankTransfer: { label: "Bank Transfer", fullLabel: "Bank Transfer", className: "tag-bank" },
  JazzCash: { label: "JazzCash", fullLabel: "JazzCash", className: "tag-jazzcash" },
  EasyPaisa: { label: "EasyPaisa", fullLabel: "EasyPaisa", className: "tag-easypaisa" },
};

function paymentDisplay(method) {
  return PAYMENT_METHOD_DISPLAY[method] || PAYMENT_METHOD_DISPLAY.COD;
}

function statusClass(status) {
  return `status-pill status-${status.toLowerCase()}`;
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    getAllOrders({ search, status: statusFilter, page, limit: 15 })
      .then((res) => {
        setOrders(res.data.orders || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Debounce search input -> search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyPayment = async (orderId, paymentStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await verifyPayment(orderId, { paymentStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: res.data.paymentStatus } : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update payment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const resolveImg = (path) => (path?.startsWith("http") ? path : `${API_ORIGIN}${path}`);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Orders</h1>
        <span className="orders-count">{total} total</span>
      </div>

      {/* Filters */}
      <div className="orders-toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by order #, name, or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="orders-search"
          />
        </div>

        <div className="status-filter-pills">
          <button
            className={`filter-pill ${statusFilter === "" ? "active" : ""}`}
            onClick={() => { setStatusFilter(""); setPage(1); }}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`filter-pill ${statusFilter === s ? "active" : ""}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <p>No orders found{search || statusFilter ? " matching your filters" : ""}.</p>
        </div>
      ) : (
        <>
          <div className="orders-table-wrap">
            <table className="admin-table orders-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr
                      key={order._id}
                      className="order-row"
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    >
                      <td className="expand-cell">
                        <span className={`expand-arrow ${expandedId === order._id ? "open" : ""}`}>▸</span>
                      </td>
                      <td className="order-id">{order.orderNumber}</td>
                      <td>
                        <div className="customer-cell">
                          <span className="customer-name">{order.shippingAddress?.fullName || order.user?.name}</span>
                          <span className="customer-phone">{order.shippingAddress?.phone}</span>
                        </div>
                      </td>
                      <td className="order-date">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td>
                        <div className="payment-cell">
                          <span className={`payment-method-tag ${paymentDisplay(order.paymentMethod).className}`}>
                            {paymentDisplay(order.paymentMethod).label}
                          </span>
                          {order.paymentMethod !== "COD" && (
                            <span className={`payment-status-tag ps-${(order.paymentStatus || "").toLowerCase()}`}>
                              {order.paymentStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="order-total">PKR {order.totalPrice?.toLocaleString()}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className={statusClass(order.status)}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {expandedId === order._id && (
                      <tr className="order-detail-row">
                        <td colSpan={7}>
                          <div className="order-detail-panel">
                            <div className="detail-grid">
                              {/* Customer */}
                              <div className="detail-block">
                                <p className="detail-label">Customer Details</p>
                                <p className="detail-line"><strong>{order.shippingAddress?.fullName}</strong></p>
                                <p className="detail-line">{order.shippingAddress?.phone}</p>
                                <p className="detail-line">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                              </div>

                              {/* Items */}
                              <div className="detail-block">
                                <p className="detail-label">Items ({order.orderItems?.length})</p>
                                {order.orderItems?.map((item, i) => (
                                  <p key={i} className="detail-line">
                                    {item.name} × {item.quantity} — PKR {(item.price * item.quantity).toLocaleString()}
                                  </p>
                                ))}
                              </div>

                              {/* Payment */}
                              <div className="detail-block">
                                <p className="detail-label">Payment</p>
                                <p className="detail-line">
                                  Method: <strong>{paymentDisplay(order.paymentMethod).fullLabel}</strong>
                                </p>
                                {order.paymentAccountLabel && (
                                  <p className="detail-line">
                                    Account: <strong>{order.paymentAccountLabel}</strong>
                                  </p>
                                )}
                                {order.paymentMethod !== "COD" && (
                                  <>
                                    <p className="detail-line">
                                      Status: <span className={`payment-status-tag ps-${(order.paymentStatus || "").toLowerCase()}`}>{order.paymentStatus}</span>
                                    </p>
                                    {order.paymentScreenshot && (
                                      <>
                                        <button
                                          className="view-screenshot-btn"
                                          onClick={() => setLightboxImg(resolveImg(order.paymentScreenshot))}
                                        >
                                          📎 View Screenshot
                                        </button>
                                        <div className="verify-actions">
                                          <button
                                            className="btn-verify"
                                            disabled={order.paymentStatus === "Verified" || updatingId === order._id}
                                            onClick={() => handleVerifyPayment(order._id, "Verified")}
                                          >
                                            ✓ Verify
                                          </button>
                                          <button
                                            className="btn-reject"
                                            disabled={order.paymentStatus === "Rejected" || updatingId === order._id}
                                            onClick={() => handleVerifyPayment(order._id, "Rejected")}
                                          >
                                            ✕ Reject
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Status history */}
                              <div className="detail-block">
                                <p className="detail-label">Status History</p>
                                <div className="status-history">
                                  {order.statusHistory?.slice().reverse().map((h, i) => (
                                    <div key={i} className="history-item">
                                      <span className={statusClass(h.status)}>{h.status}</span>
                                      <span className="history-time">
                                        {new Date(h.changedAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span>Page {page} of {pages}</span>
              <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}

      {/* Screenshot lightbox */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
            <img src={lightboxImg} alt="Payment screenshot" />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;