import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getAllOrders } from "../../services/api";
import "../../styles/admin.css";

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getAllOrders()])
      .then(([prodRes, ordersRes]) => {
        const orders = ordersRes.data;
        const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        setStats({
          products: prodRes.data.totalProducts || prodRes.data.products?.length || 0,
          orders: orders.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <Link to="/admin/add-product" className="btn-gold">+ Add Product</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Products</p>
          <p className="stat-value">{stats.products}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{stats.orders}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value">PKR {stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="admin-empty">Click the link to get all orders.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>PKR {order.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${order.status || "pending"}`}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link to="/admin/orders" className="view-all-link">View all orders →</Link>
      </div>
    </div>
  );
}

export default Dashboard;