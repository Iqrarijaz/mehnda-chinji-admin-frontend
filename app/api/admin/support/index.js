import { Axios } from "@/interceptors";

export const GET_SUPPORT_TICKETS = async (params) => {
    try {
        const response = await Axios.get("/api/admin/support/tickets", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GET_SUPPORT_TICKET_BY_ID = async (id) => {
    try {
        const response = await Axios.get(`/api/admin/support/ticket/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const REPLY_TO_TICKET = async (id, data) => {
    try {
        const response = await Axios.post(`/api/admin/support/ticket/${id}/reply`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UPDATE_TICKET_STATUS = async (id, status) => {
    try {
        const response = await Axios.post(`/api/admin/support/ticket/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GET_SUPPORT_STATUS_COUNTS = async () => {
    try {
        const response = await Axios.get("/api/admin/support/status-counts");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GET_SUPPORT_NOTIFICATIONS_OPEN = async () => {
    try {
        const response = await Axios.get("/api/admin/support/notifications/open");
        return response.data;
    } catch (error) {
        throw error;
    }
};
