import axios from "axios";

// Zentraler Axios-Client. Die Basis-URL "/api" wird im Dev-Modus
// von Vite an das Backend (Port 3001) weitergeleitet.
const api = axios.create({ baseURL: "/api" });

// Hängt das JWT (falls vorhanden) automatisch an jede Anfrage an.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
