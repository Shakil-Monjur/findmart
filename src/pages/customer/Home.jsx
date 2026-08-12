import { useState, useEffect } from "react";
import ProductCard from "../../components/customer/Home/ProductCard";
import ShopsMap from "../../components/common/ShopsMap";
import RouteMapModal from "../../components/customer/RouteMapModal";
import { useLocationContext } from "../../context/LocationContext";
import { API_BASE_URL } from "../../services/api";
import "./../../styles/home.css";
import "./../../styles/Location.css";

import { IoChevronDown } from "react-icons/io5";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

function Home() {
  const { locationGranted, userLocation, requestLocation } = useLocationContext();

  const [customerCoords, setCustomerCoords] = useState(() => {
    try {
      const stored = localStorage.getItem("userLocation");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [locLoading, setLocLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("default");
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);

  // HTML5 Geolocation detection for customer
  const handleGetCustomerLocation = () => {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCustomerCoords(coords);
        localStorage.setItem("userLocation", JSON.stringify(coords));
        setLocLoading(false);
        if (requestLocation) requestLocation();
      },
      (err) => {
        console.error("Home geolocation error:", err);
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    handleGetCustomerLocation();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products for feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by search query
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = (p.title || "").toLowerCase().includes(query);
    const descMatch = (p.description || "").toLowerCase().includes(query);
    const sellerMatch = (p.seller?.fullName || "").toLowerCase().includes(query);
    return titleMatch || descMatch || sellerMatch;
  });

  // Sort products based on sortType
  const sortedProducts = [...filteredProducts];
  if (sortType === "low") {
    sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortType === "high") {
    sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  const activeLocation = customerCoords || userLocation;

  return (
    <div className="home">
      {/* Search & Filter Controls */}
      <div className="search-section">
        <div className="price-dropdown-wrapper">
          <button
            className="price-dropdown-btn"
            onClick={() => setShowFilter(!showFilter)}
          >
            <span>Price</span>
            <IoChevronDown />
          </button>

          {showFilter && (
            <div className="filter-menu">
              <div
                className="filter-item"
                onClick={() => {
                  setSortType("default");
                  setShowFilter(false);
                }}
              >
                Default
              </div>

              <div
                className="filter-item"
                onClick={() => {
                  setSortType("low");
                  setShowFilter(false);
                }}
              >
                Price: Low → High
              </div>

              <div
                className="filter-item"
                onClick={() => {
                  setSortType("high");
                  setShowFilter(false);
                }}
              >
                Price: High → Low
              </div>
            </div>
          )}
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Location Header & Shops Map Section */}
      <div className="location-map-section">
        <div
          className="location-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaMapMarkerAlt className="location-icon" />
            <span style={{ fontWeight: "600" }}>
              Nearest Mart Locations ({sortedProducts.length} items found)
            </span>
            {customerCoords && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#16a34a",
                  background: "#dcfce7",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: "600",
                }}
              >
                📍 Detected ({customerCoords.lat.toFixed(4)}, {customerCoords.lng.toFixed(4)})
              </span>
            )}
          </div>

          {(!customerCoords || !locationGranted) && (
            <button
              className="location-btn"
              onClick={handleGetCustomerLocation}
              disabled={locLoading}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: "600",
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                cursor: locLoading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {locLoading ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaMapMarkerAlt />}
              Get My Location
            </button>
          )}
        </div>

        <ShopsMap
          products={sortedProducts}
          userLocation={activeLocation}
          selectedDestination={selectedDestination}
        />
      </div>

      {/* Product Cards Feed Section */}
      <div className="product-section">
        <div className="product-grid">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                customerLat={customerCoords?.lat}
                customerLng={customerCoords?.lng}
                onRouteClick={(ownerCoords) => setSelectedDestination(ownerCoords)}
              />
            ))
          ) : (
            <>
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </>
          )}
        </div>
      </div>

      {/* Road Route Map Modal */}
      <RouteMapModal
        isOpen={Boolean(selectedDestination)}
        onClose={() => setSelectedDestination(null)}
        origin={activeLocation}
        destination={selectedDestination}
        shopName={selectedDestination?.shopName}
      />
    </div>
  );
}

export default Home;