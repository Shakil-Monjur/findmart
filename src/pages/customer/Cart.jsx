import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useCartContext } from "../../context/CartContext";
import "../../styles/cart.css";

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice,
    totalUniqueItems,
  } = useCartContext();

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

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart-container">
          <FaShoppingBag className="empty-cart-icon" />
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-desc">
            Looks like you haven't added any products to your cart yet. Explore our products and add your favorite items!
          </p>
          <Link to="/" className="browse-products-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">
          Shopping Cart
          <span className="cart-item-count-badge">
            {totalUniqueItems} {totalUniqueItems === 1 ? "item" : "items"}
          </span>
        </h1>
      </div>

      <div className="cart-container-layout">
        <div className="cart-items-list">
          {cartItems.map((item) => {
            const itemId = item._id || item.id;
            const price = Number(item.price) || 0;
            const itemTotal = price * item.quantity;
            const imageSrc = getImageUrl(item.image);
            const sellerName =
              item.seller?.fullName ||
              item.seller?.name ||
              item.owner?.fullName ||
              "Shop";

            return (
              <div key={itemId} className="cart-item-card">
                <img
                  src={imageSrc || "https://via.placeholder.com/80"}
                  alt={item.title || "Product"}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title || "Product Title"}</h3>
                  <p className="cart-item-seller">Seller: {sellerName}</p>
                  <span className="cart-item-unit-price">${price.toFixed(2)} each</span>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control-group">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQuantity(itemId)}
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>
                    <span className="qty-number">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => increaseQuantity(itemId)}
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <span className="cart-item-total">${itemTotal.toFixed(2)}</span>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(itemId)}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary-box">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: "#16a34a", fontWeight: "600" }}>Free</span>
          </div>

          <div className="summary-row total">
            <span>Total Price</span>
            <span style={{ color: "#1d4ed8" }}>${totalPrice.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout <FaArrowRight />
          </button>

          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;