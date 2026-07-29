import ProductCard from "../../components/customer/Home/ProductCard";
import { useSavedContext } from "../../context/SavedContext";
import "./../../styles/home.css";

function Saved() {
  const { savedProducts } = useSavedContext();

  return (
    <div className="saved-page" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="saved-header">
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", margin: 0 }}>
          Saved Products
        </h2>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
          Items you've saved for later
        </p>
      </div>

      <div className="product-section">
        {savedProducts && savedProducts.length > 0 ? (
          <div className="product-grid">
            {savedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="empty-saved-state"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              color: "#6b7280",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
              No Saved Items
            </h3>
            <p style={{ fontSize: "14px", margin: 0 }}>
              You haven't saved any products yet. Click the heart icon on any product to save it here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Saved;