import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Custom Icon for User Location (Blue dot marker)
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom Icon for Shop Location (Red marker)
const shopIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Helper function to derive shop coordinates deterministically
export function getShopCoordinates(product) {
  if (!product) return { lat: 23.8103, lng: 90.4125 };

  const shopLat =
    product.lat ||
    product.latitude ||
    product.location?.lat ||
    product.seller?.lat ||
    product.seller?.latitude ||
    product.seller?.location?.lat ||
    product.owner?.lat ||
    product.owner?.latitude ||
    product.owner?.location?.lat;

  const shopLng =
    product.lng ||
    product.longitude ||
    product.location?.lng ||
    product.seller?.lng ||
    product.seller?.longitude ||
    product.seller?.location?.lng ||
    product.owner?.lng ||
    product.owner?.longitude ||
    product.owner?.location?.lng;

  if (shopLat && shopLng && !isNaN(shopLat) && !isNaN(shopLng)) {
    return { lat: Number(shopLat), lng: Number(shopLng) };
  }

  // Deterministic fallback based on seller/product ID
  const idStr =
    product._id ||
    product.id ||
    product.seller?._id ||
    product.seller?.fullName ||
    product.title ||
    "default";

  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = ((hash % 100) - 50) / 4000;
  const lngOffset = (((hash >> 2) % 100) - 50) / 4000;

  return {
    lat: 23.8103 + latOffset,
    lng: 90.4125 + lngOffset,
  };
}

// Recenter component to dynamically update map center
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Sub-component for rendering route from userLocation to selectedDestination using leaflet-routing-machine
function RoutingMachine({ userLocation, selectedDestination }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedDestination) return;

    const userLat = userLocation?.lat || 23.8103;
    const userLng = userLocation?.lng || 90.4125;
    const destLat = selectedDestination.lat;
    const destLng = selectedDestination.lng;

    if (!destLat || !destLng) return;

    let routingControl;
    try {
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLat, userLng),
          L.latLng(destLat, destLng),
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false,
        lineOptions: {
          styles: [{ color: "#2563eb", weight: 5, opacity: 0.8 }],
        },
      }).addTo(map);
    } catch (err) {
      console.error("Routing control error:", err);
    }

    return () => {
      if (routingControl && map) {
        try {
          map.removeControl(routingControl);
        } catch (err) {
          console.error("Error removing routing control:", err);
        }
      }
    };
  }, [map, userLocation, selectedDestination]);

  return null;
}

function ShopsMap({ products = [], userLocation, selectedDestination }) {
  const defaultCenter = { lat: 23.8103, lng: 90.4125 };
  const center = userLocation && userLocation.lat && userLocation.lng ? userLocation : defaultCenter;

  // Extract unique shops based on coordinates
  const uniqueShopsMap = new Map();

  (products || []).forEach((product) => {
    const coords = getShopCoordinates(product);
    const shopName =
      product.seller?.fullName ||
      product.seller?.name ||
      product.owner?.fullName ||
      product.owner?.name ||
      "Shop Mart";

    const key = `${coords.lat.toFixed(5)},${coords.lng.toFixed(5)}`;

    if (!uniqueShopsMap.has(key)) {
      uniqueShopsMap.set(key, {
        id: key,
        name: shopName,
        lat: coords.lat,
        lng: coords.lng,
        productCount: 1,
      });
    } else {
      const existing = uniqueShopsMap.get(key);
      existing.productCount += 1;
    }
  });

  const uniqueShops = Array.from(uniqueShopsMap.values());

  return (
    <div style={{ width: "100%", height: "350px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={false}
      >
        <RecenterMap center={center} />
        <RoutingMachine userLocation={userLocation} selectedDestination={selectedDestination} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div style={{ textAlign: "center", fontWeight: "600" }}>
                📍 Your Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Shop Markers */}
        {uniqueShops.map((shop) => (
          <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={shopIcon}>
            <Popup>
              <div style={{ padding: "4px" }}>
                <strong style={{ fontSize: "14px", color: "#111827" }}>{shop.name}</strong>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                  {shop.productCount} {shop.productCount === 1 ? "product" : "products"} available
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ShopsMap;
