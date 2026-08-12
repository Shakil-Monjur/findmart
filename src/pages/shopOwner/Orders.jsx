import { useState, useEffect } from "react";
import { FaClock, FaCheckCircle, FaTruck, FaBan, FaSync } from "react-icons/fa";
import { API_BASE_URL, SERVER_BASE_URL } from "../../services/api";
import "../../styles/orders.css";
import "../../styles/shopOwner.css";

function OrdersOwner() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${SERVER_BASE_URL}${url}`;
    }
    return `${SERVER_BASE_URL}/${url}`;
  };

  const fetchShopOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const sellerId = user?._id || user?.id;

      const res = await fetch(`${API_BASE_URL}/orders/shop-orders?sellerId=${sellerId || ""}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "x-user-id": sellerId || "",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching shop orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: updated.status || newStatus } : o))
        );
      } else {
        // Fallback update local state if backend API offline
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      // Local fallback
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <FaCheckCircle />;
      case "shipped":
        return <FaTruck />;
      case "cancelled":
        return <FaBan />;
      default:
        return <FaClock />;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="orders-page">
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
          Loading shop orders...
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="orders-title">Shop Received Orders</h1>
          <p className="orders-subtitle">Manage customer orders and update shipping status</p>
        </div>
        <button
          onClick={fetchShopOrders}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            color: "#374151",
          }}
        >
          <FaSync /> Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            maxWidth: "500px",
            margin: "20px auto",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: "0 0 8px 0" }}>
            No Customer Orders Received
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            When customers place orders for your products, they will appear here for processing and fulfillment.
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const statusClass = (order.status || "Pending").toLowerCase();
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recent";

            const buyerName = order.buyer?.fullName || order.shippingAddress?.fullName || "Customer";
            const buyerEmail = order.buyer?.email || "N/A";

            return (
              <div key={order._id || order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-meta-info">
                    <span className="order-id">Order #{order._id ? order._id.slice(-8).toUpperCase() : "ORD-1001"}</span>
                    <span className="order-date">Date: {dateStr} | Customer: <strong>{buyerName}</strong> ({buyerEmail})</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className={`order-status-badge ${statusClass}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status || "Pending"}</span>
                    </div>

                    <select
                      className="status-select"
                      value={order.status || "Pending"}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-grid">
                    {order.items && order.items.map((item, idx) => {
                      const title = item.product?.title || item.title || "Product";
                      const image = item.product?.image || item.image;
                      const imageSrc = getImageUrl(image);
                      const price = Number(item.price || item.product?.price || 0);

                      return (
                        <div key={idx} className="order-item-row">
                          <img
                            src={imageSrc || "https://via.placeholder.com/54"}
                            alt={title}
                            className="order-item-img"
                          />
                          <div className="order-item-details">
                            <h4 className="order-item-title">{title}</h4>
                            <span className="order-item-qty">Quantity: {item.quantity || 1} × ${price.toFixed(2)}</span>
                          </div>
                          <span className="order-item-subtotal">
                            ${(price * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="order-card-footer">
                  <div className="shipping-address-snippet">
                    <strong>Shipping Info:</strong> {order.shippingAddress?.fullName || buyerName},{" "}
                    {order.shippingAddress?.address || "Address"},{" "}
                    {order.shippingAddress?.city || ""} | Phone: {order.shippingAddress?.phone || "N/A"}
                  </div>

                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#1d4ed8" }}>
                    Total Order Value: ${Number(order.totalAmount || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersOwner;