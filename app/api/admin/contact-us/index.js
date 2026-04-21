import { Axios } from "@/interceptors";

export const GET_CONTACT_REQUESTS = async (params) => {
    try {
        const response = await Axios.get("/api/admin/contact-us/list", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GET_CONTACT_REQUEST_BY_ID = async (id) => {
    try {
        const response = await Axios.get(`/api/admin/contact-us/get/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UPDATE_CONTACT_REQUEST_STATUS = async (id, status) => {
    try {
        const response = await Axios.post(`/api/admin/contact-us/update-status/${id}`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DELETE_CONTACT_REQUEST = async (id) => {
    try {
        const response = await Axios.post(`/api/admin/contact-us/remove/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GET_CONTACT_STATUS_COUNTS = async () => {
    try {
        const response = await Axios.get("/api/admin/dashboard/contact-us-counts");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GET_CONTACT_NOTIFICATIONS_PENDING = async () => {
    try {
        const response = await Axios.get("/api/admin/contact-us/notifications/pending");
        return response.data;
    } catch (error) {
        throw error;
    }
};
