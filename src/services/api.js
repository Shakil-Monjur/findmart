// Frontend API Configuration for Online Deployment & Local Dev
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://findmart.onrender.com/api";

export const SERVER_BASE_URL =
  import.meta.env.VITE_SERVER_URL || "https://findmart.onrender.com";

export const getImageUrl = (url, defaultImage = "") => {
  if (!url) return defaultImage;
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `${SERVER_BASE_URL}${url}`;
  }
  return `${SERVER_BASE_URL}/${url}`;
};

export default API_BASE_URL;
