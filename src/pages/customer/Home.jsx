import { useState } from "react";
import ProductCard from "../../components/customer/Home/ProductCard";
import "./../../styles/home.css";

import { IoChevronDown } from "react-icons/io5";

function Home() {
  const products = [
    { id: 1, name: "Apple", price: 120 },
    { id: 2, name: "Milk", price: 80 },
    { id: 3, name: "Rice", price: 150 },
  ];

  const [sortType, setSortType] = useState("default");
  const [showFilter, setShowFilter] = useState(false);

  const sortedProducts = [...products];

  if (sortType === "low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sortType === "high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="home">
      <div className="search-section">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search products..."
          />
        </div>

        <button
          className="filter-btn"
          onClick={() => setShowFilter(!showFilter)}
        >
          
          <span>Filter</span>
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

        <button className="search-btn">
          Search
        </button>
      </div>

      {/* Current Location */}
      <div className="location-section">
        <h3>Your Current Location</h3>

        <p>No location selected.</p>

        <button className="location-btn">
          Use Current Location
        </button>
      </div>

      {/* Map */}
      <div className="map-section">
        Google Map
      </div>

      {/* Products */}
      <div className="product-section">
        <h2>Nearest Products</h2>

        <div className="product-grid">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;