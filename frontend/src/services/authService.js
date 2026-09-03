import api from "./api";

// Connecter l'utilisateur
export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  // Retourner les données
  return response.data;
};