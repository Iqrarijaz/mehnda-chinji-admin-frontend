import { Axios } from "@/interceptors";

export async function GET_USERS(params) {
    try {
        const response = await Axios.get("/api/admin/users/list", { params });
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

export async function CREATE_USER(data) {
    try {
        const response = await Axios.post("/api/admin/users/create", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_USER(data) {
    try {
        const response = await Axios.post("/api/admin/users/update", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function DELETE_USER(data) {
    try {
        const response = await Axios.post("/api/admin/users/remove", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function RESET_USER_PASSWORD(data) {
    try {
        const response = await Axios.post("/api/admin/users/reset-password", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
