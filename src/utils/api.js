import { BASE_URL } from "../constants";

export const fetchWithAuth = async (endpoint, method = "GET", headers = {}, body = null) => {
  const token = localStorage.getItem("authToken");

  // If token is missing, restrict protected calls
  if (!token && endpoint !== "/users/register" && endpoint !== "/users/login") {
    throw new Error("Unauthorized: No token found. Please login.");
  }

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  return response.json();
};
