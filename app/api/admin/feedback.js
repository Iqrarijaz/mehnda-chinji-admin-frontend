import { Axios } from "@/interceptors";

export async function GET_FEEDBACK(params) {
    try {
        const response = await Axios.get("/api/admin/feedback/list", { params });
        return {
            data: response.data.data,
            pagination: response.data.pagination || {},
        };
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_FEEDBACK_STATUS(id, status) {
    try {
        const response = await Axios.post("/api/admin/feedback/update", { _id: id, status });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function DELETE_FEEDBACK(id) {
    try {
        const response = await Axios.post("/api/admin/feedback/delete", { _id: id });
        return response.data;
    } catch (error) {
        throw error;
    }
}
