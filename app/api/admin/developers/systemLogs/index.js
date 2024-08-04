import { Axios } from "@/interceptors";

export async function LIST_SYSTEM_LOGS(data) {
  try {
    const response = await Axios.post(
      "/api/admin/developers/system_logs/list",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function DELETE_SYSTEM_LOG(data) {
  try {
    const response = await Axios.post(
      "/api/admin/developers/system_logs/delete",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
