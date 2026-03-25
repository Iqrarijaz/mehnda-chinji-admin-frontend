import { Axios } from "@/interceptors";

export async function GET_APP_IMAGES(data) {
    try {
        const response = await Axios.get("/api/admin/app-images/list", { params: data });
        return response.data;
    } catch (error) {
        console.error("Error fetching app images:", error);
        throw error;
    }
}

export async function CREATE_APP_IMAGES(formData) {
    try {
        const response = await Axios.post("/api/admin/app-images/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating app images:", error);
        throw error;
    }
}

export async function UPDATE_APP_IMAGES(formData) {
    try {
        const response = await Axios.post("/api/admin/app-images/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating app images:", error);
        throw error;
    }
}

export async function DELETE_APP_IMAGES(id) {
    try {
        const response = await Axios.post(`/api/admin/app-images/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting app images:", error);
        throw error;
    }
}
