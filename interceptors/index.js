
import axios from "axios";
import { baseUrl } from "../config";

export const Axios = axios.create({
  baseURL: baseUrl,
});

Axios.interceptors.request.use(
  function (config) {
    let local = JSON.parse(localStorage.getItem("userData"))
    const token = local?.userData?.token
    if (token) {
      config.headers['Authorization'] = token
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

