import { Axios } from "@/interceptors";

// Get list of system logs with filters and pagination
export async function GET_SYSTEM_LOGS(data) {
    try {
        const response = await Axios.get("/api/admin/logs/list", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching system logs:", error);
        throw error;
    }
}
