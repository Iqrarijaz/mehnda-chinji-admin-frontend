import { Axios } from "@/interceptors";
export async function GET_ROLES(params) {
    try {
        const response = await Axios.get("/api/admin/roles/list", { params });
        return {
            data: {
                docs: response.data.data,
                totalDocs: response.data.pagination.totalItems,
                limit: response.data.pagination.itemsPerPage,
                page: response.data.pagination.currentPage,
                totalPages: response.data.pagination.totalPages
            }
        };
    } catch (error) {
        throw error;
    }
}

export async function CREATE_ROLE(data) {
    try {
        const response = await Axios.post("/api/admin/roles/create", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function UPDATE_ROLE(data) {
    try {
        const response = await Axios.post("/api/admin/roles/update", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function DELETE_ROLE(data) {
    try {
        const response = await Axios.post("/api/admin/roles/remove", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function GET_PERMISSIONS() {
    try {
        const response = await Axios.get("/api/admin/permissions/list");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function GET_ACTIVE_ROLES() {
    try {
        const response = await Axios.get("/api/admin/roles/active");
        return response.data;
    } catch (error) {
        throw error;
    }
}
