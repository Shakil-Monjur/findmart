import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import { useLocationContext } from "../../context/LocationContext";
import "./../../styles/Location.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

function Location() {
  const { locationGranted, userLocation, requestLocation } = useLocationContext();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  return (
    <div>
      {!locationGranted ? (
        /* Current Location Box */
        <div className="location-section">
          <h3>Your Current Location</h3>
          <p>No location selected.</p>
          <button className="location-btn" onClick={requestLocation}>
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
        <div className="location-section">Error loading map</div>
      ) : (
        <div className="location-section">Loading Map...</div>
      )}
    </div>
  );
}

export default Location;
