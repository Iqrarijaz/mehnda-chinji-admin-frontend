import axios from "axios";
import { baseUrl } from "@/config";
export async function LIST_USERS(data) {
  try {
    const response = await axios.post(`${baseUrl}/api/admin/order/list`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
