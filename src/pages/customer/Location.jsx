import "./../../styles/Location.css";
function Location() {
  return (
    <div>
      {/* Current Location */}
      <div className="location-section">
        <h3>Your Current Location</h3>

        <p>No location selected.</p>

        <button className="location-btn">
          Use Current Location
        </button>
      </div>
    </div>
  );
}

export default Location;