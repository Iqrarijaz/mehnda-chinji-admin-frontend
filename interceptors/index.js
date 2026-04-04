import axios from "axios";
import { baseUrl } from "../config";

export const Axios = axios.create({
  baseURL: baseUrl,
});

// Session expired callback - will be set by SessionProvider
let onSessionExpired = null;

export const setSessionExpiredCallback = (callback) => {
  onSessionExpired = callback;
};

// Request interceptor - adds auth token
Axios.interceptors.request.use(
  function (config) {
    if (typeof window !== "undefined") {
      let local = JSON.parse(localStorage.getItem("userData"));
      const token = local?.token;
      if (token) {
        config.headers["Authorization"] = token;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor - handles session expiration
Axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Check for 401 Unauthorized (session expired)
    if (error.response?.status === 401) {
      if (onSessionExpired) {
        onSessionExpired();
      }
    }

    // Extract detailed error message from response, or use fallbacks
    const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
    
    // Attach the clean message to the error object for consistent component access
    error.errorMessage = errorMessage;

    return Promise.reject(error);
  }
);
