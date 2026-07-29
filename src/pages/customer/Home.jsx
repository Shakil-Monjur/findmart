import { useState, useEffect } from "react";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import ProductCard from "../../components/customer/Home/ProductCard";
import { useLocationContext } from "../../context/LocationContext";
import "./../../styles/home.css";
import "./../../styles/Location.css";

import { IoChevronDown } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

function Home() {
  const { locationGranted, userLocation, requestLocation } = useLocationContext();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("default");
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://findmart.onrender.com/api/products");
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

      {/* Location Header & Google Map Section */}
      <div className="location-map-section">
        <div className="location-header">
          <FaMapMarkerAlt className="location-icon" />
          <span>Nearest Mart By location</span>
        </div>

        {!locationGranted ? (
          <div className="location-section">
            <h3>Your Current Location</h3>
            <p>No location selected.</p>
            <button
              className="location-btn"
              onClick={requestLocation}
            >
              Use Current Location
            </button>
          </div>
        ) : isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={12}
          />
        ) : loadError ? (
          <div className="map-placeholder">Error loading map</div>
        ) : (
          <div className="map-placeholder">Loading Map...</div>
        )}
      </div>

      {/* Product Cards Feed Section */}
      <div className="product-section">
        <div className="product-grid">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
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
    </div>
  );
}

export default Home;