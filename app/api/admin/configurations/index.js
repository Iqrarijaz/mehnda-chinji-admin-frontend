import { Axios } from "@/interceptors";

export async function CONFIGURATIONS(data) {
    try {
        const response = await Axios.get("/api/admin/configuration/list", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching configurations:", error);
        throw error;
    }
}

export async function CREATE_CONFIGURATION(data) {
    try {
        const response = await Axios.post("/api/admin/configuration/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating configuration:", error);
        throw error;
    }
}

export async function UPDATE_CONFIGURATION(data) {
    try {
        const response = await Axios.post("/api/admin/configuration/update", data);
        return response.data;
    } catch (error) {
        console.error("Error updating configuration:", error);
        throw error;
    }
}

export async function DELETE_CONFIGURATION(id) {
    try {
        const response = await Axios.post(`/api/admin/configuration/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting configuration:", error);
        throw error;
    }
}
