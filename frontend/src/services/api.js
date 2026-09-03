import axios from "axios";

// Créer la connexion avec l'API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

// Ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Rediriger si le token est invalide
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;