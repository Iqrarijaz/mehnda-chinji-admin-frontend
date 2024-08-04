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
