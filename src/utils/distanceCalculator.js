function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined ||
    lat1 === null ||
    lon1 === null ||
    lat2 === null ||
    lon2 === null ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return null;
  }

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(Number(lat2) - Number(lat1));
  const dLon = deg2rad(Number(lon2) - Number(lon1));
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(Number(lat1))) *
      Math.cos(deg2rad(Number(lat2))) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m Away`;
  }
  return `${distance.toFixed(1)} km Away`;
}

export default calculateDistance;
