import { Axios } from "@/interceptors";

export async function GET_BUSINESSES(data) {
    try {
        const response = await Axios.get("/api/admin/business/list", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching businesses:", error);
        throw error;
    }
}

export async function GET_BUSINESS(id) {
    try {
        const response = await Axios.get("/api/admin/business/get", {
            params: { _id: id },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching business:", error);
        throw error;
    }
}

export async function CREATE_BUSINESS(data) {
    try {
        const response = await Axios.post("/api/admin/business/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating business:", error);
        throw error;
    }
}

export async function UPDATE_BUSINESS(data) {
    try {
        const response = await Axios.post("/api/admin/business/update", data);
        return response.data;
    } catch (error) {
        console.error("Error updating business:", error);
        throw error;
    }
}

export async function UPDATE_BUSINESS_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/business/update-status", data);
        return response.data;
    } catch (error) {
        console.error("Error updating business status:", error);
        throw error;
    }
}

export async function DELETE_BUSINESS(data) {
    try {
        const response = await Axios.post("/api/admin/business/delete", data);
        return response.data;
    } catch (error) {
        console.error("Error deleting business:", error);
        throw error;
    }
}

export async function GET_BUSINESS_STATUS_COUNTS() {
    try {
        const response = await Axios.get("/api/admin/business/status-counts");
        return response.data;
    } catch (error) {
        console.error("Error fetching business status counts:", error);
        throw error;
    }
}

