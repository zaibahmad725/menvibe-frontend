import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import "../styles/trackorder.css";

const STAGES = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"];

const CURRENT_STAGE_COPY = {
  Pending: "Order received",
  Confirmed: "Order confirmed",
  Packed: "Packed and ready",
  Shipped: "On its way",
  Delivered: "Delivered",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function findStageDate(statusHistory, stage) {
  const entry = statusHistory?.find((h) => h.status === stage);
  return entry ? formatDate(entry.changedAt) : "";
}

function OrderSummary({ order }) {
  return (
    <div className="order-summary">
      <div className="order-summary-row">
        <span>Placed on</span>
        <strong>{formatDate(order.createdAt)}</strong>
      </div>
      <div className="order-summary-row">
        <span>Items</span>
        <strong>{order.itemCount}</strong>
      </div>
      <div className="order-summary-row">
        <span>Shipping to</span>
        <strong>{order.city || "—"}</strong>
      </div>
      <div className="order-summary-row">
        <span>Payment</span>
        <strong>
          {order.paymentMethod}
          {order.paymentMethod !== "COD" ? ` · ${order.paymentStatus}` : ""}
        </strong>
      </div>
      <div className="order-summary-row order-summary-total">
        <span>Total</span>
        <strong>PKR {order.totalPrice?.toLocaleString()}</strong>
      </div>
    </div>
  );
}

function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = useCallback(
    async (numberToTrack) => {
      const value = (numberToTrack ?? orderNumber).trim();
      if (!value) return;

      setLoading(true);
      setNotFound(false);

      try {
        // NOTE: backend mounts this router at /api/track (see server.js),
        // not /api/orders/track — this path must match that exactly.
        const res = await api.get(`/track/${encodeURIComponent(value)}`);
        setOrder(res.data);
      } catch (error) {
        setOrder(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    },
    [orderNumber]
  );

  // Arriving from the order-confirmation popup with ?order=XYZ — prefill and search automatically
  useEffect(() => {
    const fromUrl = searchParams.get("order");
    if (fromUrl) {
      handleTrack(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  const handleSearchAgain = () => {
    setOrder(null);
    setNotFound(false);
    setOrderNumber("");
  };

  const currentStageIndex = order ? STAGES.indexOf(order.status) : -1;
  const isCancelled = order?.status === "Cancelled";
  const progressPct =
    currentStageIndex >= 0 ? (currentStageIndex / (STAGES.length - 1)) * 100 : 0;

  return (
    <div className="track-page">
      <div className="track-shell">
        {!order && (
          <div className="track-card track-search-card">
            <p className="track-eyebrow">Order Tracking</p>
            <h1>Track your order</h1>
            <p className="track-sub">
              Enter the order number from your confirmation email or popup.
            </p>

            <form onSubmit={handleSubmit} className="track-form">
              <div className="form-group">
                <label htmlFor="orderNumber">Order Number</label>
                <input
                  id="orderNumber"
                  type="text"
                  placeholder="e.g. ORD-10234"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn-gold track-submit"
                disabled={loading || !orderNumber.trim()}
              >
                {loading ? "Searching…" : "Track Order"}
              </button>
            </form>

            {notFound && (
              <div className="track-error">
                <p className="track-error-title">
                  We couldn't find an order with that number.
                </p>
                <p className="track-error-sub">
                  Double-check the number from your confirmation email, then try
                  again. Still no luck? Contact support with your order details
                  and we'll look it up for you.
                </p>
              </div>
            )}
          </div>
        )}

        {order && isCancelled && (
          <div className="track-card track-result-card track-cancelled">
            <button className="track-back" onClick={handleSearchAgain}>
              ← Track another order
            </button>
            <span className="cancelled-badge">Cancelled</span>
            <h2 className="track-order-number">{order.orderNumber}</h2>
            <p className="cancelled-message">
              This order was cancelled and will not be processed. If this
              wasn't expected, contact support with your order number.
            </p>
            <OrderSummary order={order} />
          </div>
        )}

        {order && !isCancelled && (
          <div className="track-card track-result-card">
            <button className="track-back" onClick={handleSearchAgain}>
              ← Track another order
            </button>
            <p className="track-eyebrow">Order Number</p>
            <h2 className="track-order-number">{order.orderNumber}</h2>

            <div className="hour-rail">
              <div className="hour-line">
                <div
                  className="hour-line-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="hour-markers">
                {STAGES.map((stage, i) => {
                  const done = i < currentStageIndex;
                  const current = i === currentStageIndex;
                  const stageDate = findStageDate(order.statusHistory, stage);
                  return (
                    <div
                      key={stage}
                      className={`hour-stage ${done ? "is-done" : ""} ${
                        current ? "is-current" : ""
                      }`}
                    >
                      <span className="hour-tick" />
                      <p className="hour-label">{stage}</p>
                      <p className="hour-sub">
                        {current ? CURRENT_STAGE_COPY[stage] : stageDate}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <OrderSummary order={order} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;