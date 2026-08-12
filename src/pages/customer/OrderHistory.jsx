import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaClock, FaCheckCircle, FaTruck, FaBan } from "react-icons/fa";
import "../../styles/orders.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `https://findmart.onrender.com${url}`;
    }
    return `https://findmart.onrender.com/${url}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const buyerId = user?._id || user?.id;

        const res = await fetch(`https://findmart.onrender.com/api/orders/myorders?buyerId=${buyerId || ""}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "x-user-id": buyerId || "",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  if (loading) {
    return (
      <div className="orders-page">
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-title">Order History</h1>
        <p className="orders-subtitle">Track your past purchases and current status</p>
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
          <FaBoxOpen style={{ fontSize: "54px", color: "#9ca3af", marginBottom: "16px" }} />
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: "0 0 8px 0" }}>
            No Orders Yet
          </h2>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 20px 0" }}>
            You haven't placed any orders yet. Start exploring and order your favorite products!
          </p>
          <Link
            to="/"
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Start Shopping
          </Link>
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
                })
              : "Recent";

            return (
              <div key={order._id || order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-meta-info">
                    <span className="order-id">Order #{order._id ? order._id.slice(-8).toUpperCase() : "ORD-1001"}</span>
                    <span className="order-date">Placed on {dateStr}</span>
                  </div>

                  <div className={`order-status-badge ${statusClass}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status || "Pending"}</span>
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
                            <span className="order-item-qty">Qty: {item.quantity || 1} × ${price.toFixed(2)}</span>
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
                    <strong>Shipping to:</strong>{" "}
                    {order.shippingAddress?.fullName || "Customer"},{" "}
                    {order.shippingAddress?.address || "Address"}
                    {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ""}
                  </div>

                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#1d4ed8" }}>
                    Total: ${Number(order.totalAmount || 0).toFixed(2)}
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

export default OrderHistory;
