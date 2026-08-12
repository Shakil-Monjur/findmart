import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { FaTimes, FaDirections } from "react-icons/fa";

// Red & Blue marker icons
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const shopIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RouteMapModal({ isOpen, onClose, origin, destination, shopName }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !origin || !destination || !containerRef.current) return;

    const originLat = Number(origin.lat);
    const originLng = Number(origin.lng);
    const destLat = Number(destination.lat);
    const destLng = Number(destination.lng);

    if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) return;

    const centerLat = (originLat + destLat) / 2;
    const centerLng = (originLng + destLng) / 2;

    // Initialize Leaflet Map
    if (!mapRef.current) {
      const map = L.map(containerRef.current).setView([centerLat, centerLng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;
    } else {
      mapRef.current.setView([centerLat, centerLng], 13);
    }

    const map = mapRef.current;

    // Clean up previous routing control
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch {
        // ignore
      }
      routingControlRef.current = null;
    }

    // Initialize Leaflet Routing Machine
    if (L.Routing && L.Routing.control) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(originLat, originLng),
          L.latLng(destLat, destLng),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: function (i, waypoint) {
          const marker = L.marker(waypoint.latLng, {
            icon: i === 0 ? userIcon : shopIcon,
          });
          marker.bindPopup(i === 0 ? "Your Location" : (shopName || "Shop Location"));
          return marker;
        },
        lineOptions: {
          styles: [{ color: "#2563eb", opacity: 0.85, weight: 6 }],
        },
      }).addTo(map);

      routingControlRef.current = routingControl;
    }

    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      if (routingControlRef.current && mapRef.current) {
        try {
          mapRef.current.removeControl(routingControlRef.current);
        } catch {
          // ignore
        }
        routingControlRef.current = null;
      }
    };
  }, [isOpen, origin, destination, shopName]);

  useEffect(() => {
    if (!isOpen && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          height: "85vh",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f9fafb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaDirections style={{ fontSize: "22px", color: "#2563eb" }} />
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: 0 }}>
                Road Route to {shopName || "Shop"}
              </h3>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                OpenStreetMap Free Navigation & Turn-by-Turn Road Route
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#374151",
              padding: "6px 10px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
            title="Close Route Map"
          >
            <FaTimes />
          </button>
        </div>

        {/* Leaflet Routing Map Container */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}

export default RouteMapModal;
