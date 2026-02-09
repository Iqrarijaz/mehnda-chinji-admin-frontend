import { Axios } from "@/interceptors";

export async function GET_ADMIN_USERS(params) {
    try {
        const response = await Axios.get("/api/admin/moderators/list", { params });
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

export async function CREATE_ADMIN_USER(data) {
    try {
        const response = await Axios.post("/api/admin/moderators/create", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_ADMIN_USER(data) {
    try {
        const response = await Axios.post("/api/admin/moderators/update", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_ADMIN_USER_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/moderators/update", {
            _id: data._id,
            status: data.status
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function DELETE_ADMIN_USER(data) {
    try {
        const response = await Axios.post("/api/admin/moderators/remove", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
