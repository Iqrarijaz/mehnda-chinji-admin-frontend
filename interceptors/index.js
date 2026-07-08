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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - adds auth token
Axios.interceptors.request.use(
  function (config) {
    if (typeof window !== "undefined") {
      let local = JSON.parse(localStorage.getItem("userData"));
      const token = local?.token;
      if (token && !config.headers["Authorization"]) {
        const normalizedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        config.headers["Authorization"] = normalizedToken;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor - handles token refresh and queueing
Axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // Check for 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, put the request in a queue
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return Axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Mocking failure to show fallback behavior since we don't have a refresh endpoint yet
        throw new Error("Refresh endpoint not implemented yet");


      } catch (refreshError) {
        processQueue(refreshError, null);
        if (onSessionExpired) {
          onSessionExpired();
        }

        const errorMessage = error.response?.data?.message || error.message || "Session expired";
        error.errorMessage = errorMessage;
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Standard error formatting
    const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";
    error.errorMessage = errorMessage;
    return Promise.reject(error);
  }
);
