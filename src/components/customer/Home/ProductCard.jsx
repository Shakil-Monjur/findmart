import "./../../../styles/productCard.css";

function ProductCard() {
  return (
    <div className="product-card">

      <div className="product-image">
        <img
          src="https://placehold.co/300x200"
          alt="Product"
        />
      </div>

      <div className="product-content">

        <h3 className="product-name">
          Fresh Apple
        </h3>

        <p className="shop-name">
          Rahim Store
        </p>

        <div className="product-info">

          <span>৳250</span>

          <span>250 m</span>

        </div>

        <button>
          View Details
        </button>

      </div>

    </div>
  );
}

export default ProductCard;