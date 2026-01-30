import axios from "axios";
import { baseUrl } from "@/config";

export async function LOGIN(data) {
  try {
    const response = await axios.post(`${baseUrl}/auth/admin/login`, data);
    return response.data;
  } catch (error) {
    console.error("Invalid email or password", error);
    throw error;
  }
}

export async function LOGOUT() {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = userData?.token;

    const response = await axios.post(
      `${baseUrl}/auth/admin/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Logout error", error);
    // Even if logout fails on server, we should still clear localStorage
    throw error;
  }
}
