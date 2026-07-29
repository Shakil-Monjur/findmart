import { createContext, useState, useContext } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [locationGranted, setLocationGranted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setLocationGranted(true);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          setUserLocation({ lat: 23.8103, lng: 90.4125 });
          setLocationGranted(true);
        }
      );
    } else {
      setUserLocation({ lat: 23.8103, lng: 90.4125 });
      setLocationGranted(true);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        locationGranted,
        userLocation,
        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  return useContext(LocationContext);
}

export default LocationContext;
