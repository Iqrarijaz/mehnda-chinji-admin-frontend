import { Axios } from "@/interceptors";

export async function GET_BLOOD_DONORS(params) {
    try {
        const response = await Axios.get("/api/admin/blood-donors/list", { params });
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

export async function CREATE_BLOOD_DONOR(data) {
    try {
        const response = await Axios.post("/api/admin/blood-donors/create", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_BLOOD_DONOR(data) {
    try {
        const response = await Axios.post("/api/admin/blood-donors/update", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function DELETE_BLOOD_DONOR(data) {
    try {
        const response = await Axios.post("/api/admin/blood-donors/remove", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
