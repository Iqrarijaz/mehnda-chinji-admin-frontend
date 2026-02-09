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
      // Trigger session expired modal
      if (onSessionExpired) {
        onSessionExpired();
      }
    }
    return Promise.reject(error);
  }
);
