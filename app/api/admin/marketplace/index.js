import { Axios } from "@/interceptors";

export async function GET_MARKETPLACE_LIST(params) {
    try {
        const response = await Axios.get("/api/admin/marketplace/list", { params });
        return {
            data: {
                docs: response.data.data,
                totalDocs: response.data.pagination?.total || 0,
                limit: response.data.pagination?.limit || 10,
                page: response.data.pagination?.page || 1,
                totalPages: response.data.pagination?.pages || 1
            }
        };
    } catch (error) {
        throw error;
    }
}

export async function CREATE_MARKETPLACE(data) {
    try {
        const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
        const response = await Axios.post("/api/admin/marketplace/create", data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_MARKETPLACE(data) {
    try {
        const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
        const response = await Axios.post("/api/admin/marketplace/update", data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_MARKETPLACE_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/marketplace/update-status", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function DELETE_MARKETPLACE(data) {
    try {
        const response = await Axios.post("/api/admin/marketplace/delete", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
