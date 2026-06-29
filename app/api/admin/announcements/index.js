import { Axios } from "@/interceptors";

export async function GET_ANNOUNCEMENTS(params) {
    try {
        const response = await Axios.get("/api/admin/announcements/list", { params });
        return {
            data: {
                docs: response.data.data,
                totalDocs: response.data.pagination?.total || 0,
                limit: response.data.pagination?.limit || 10,
                page: response.data.pagination?.page || 1,
                totalPages: response.data.pagination?.totalPages || 1
            }
        };
    } catch (error) {
        throw error;
    }
}

export async function CREATE_ANNOUNCEMENT(data) {
    try {
        const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
        const response = await Axios.post("/api/admin/announcements/create", data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_ANNOUNCEMENT(data) {
    try {
        const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
        const response = await Axios.post("/api/admin/announcements/update", data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function DELETE_ANNOUNCEMENT(data) {
    try {
        const response = await Axios.post("/api/admin/announcements/delete", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
