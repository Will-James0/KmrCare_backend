import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://will1285.pythonanywhere.com';
const authEndpoint = import.meta.env.VITE_API_AUTH_ENDPOINT || '/auth';
const careEndpoint = import.meta.env.VITE_API_CARE_ENDPOINT || '/care';
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || '/api';

// Fonction pour ajouter le token dans headers
const getHeadersWithToken = (token) => ({
  Accept: "application/json",
  Authorization: token ? `Bearer ${token}` : undefined,
});

// Création d’une instance Axios pour auth
const serverAuth = (token) => axios.create({
  baseURL: `${baseURL}${authEndpoint}`,
  headers: getHeadersWithToken(token),
});

// Instance Axios pour le module "care"
const serverCare = (token) => axios.create({
  baseURL: `${baseURL}${careEndpoint}`,
  headers: getHeadersWithToken(token),
});

// Instance Axios pour le module API (rendez-vous par ex)
const serverApi = (token) => axios.create({
  baseURL: `${baseURL}${apiEndpoint}`,
  headers: getHeadersWithToken(token),
});

export default serverApi;
export { serverCare, serverApi };
