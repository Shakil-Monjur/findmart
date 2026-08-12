import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

const pinIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({ onLocationSelect, setPosition }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }
    },
  });
  return null;
}

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && position.lat && position.lng) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  return null;
}

function LocationPicker({ initialLocation, onLocationSelect, height = "320px" }) {
  const defaultCenter = { lat: 23.8103, lng: 90.4125 };
  const [position, setPosition] = useState(initialLocation || defaultCenter);

  useEffect(() => {
    if (initialLocation && initialLocation.lat && initialLocation.lng) {
      setPosition(initialLocation);
    }
  }, [initialLocation]);

  return (
    <div style={{ width: "100%", height, borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={false}
      >
        <RecenterMap position={position} />
        <MapClickHandler onLocationSelect={onLocationSelect} setPosition={setPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && position.lat && position.lng && (
          <Marker position={[position.lat, position.lng]} icon={pinIcon}>
            <Popup>
              <div style={{ textAlign: "center", fontSize: "13px" }}>
                <strong>Selected Location</strong>
                <br />
                Lat: {position.lat.toFixed(5)}, Lng: {position.lng.toFixed(5)}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default LocationPicker;
