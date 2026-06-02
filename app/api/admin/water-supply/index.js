import { Axios } from "@/interceptors";

// Connections
export const CREATE_CONNECTION = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/connections/create", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const LIST_CONNECTIONS = async (params) => {
    try {
        const response = await Axios.get("/api/admin/water-supply/connections/list", { params });
        return {
            data: {
                docs: response.data.data,
                stats: response.data.stats,
                totalDocs: response.data.pagination?.totalItems || 0,
                limit: response.data.pagination?.itemsPerPage || 20,
                page: response.data.pagination?.currentPage || 1,
                totalPages: response.data.pagination?.totalPages || 1
            }
        };
    } catch (error) {
        throw error;
    }
};

export const UPDATE_CONNECTION = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/connections/update", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const DELETE_CONNECTION = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/connections/delete", data);
        return response;
    } catch (error) {
        throw error;
    }
};

// Bills
export const CREATE_BILL = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/bills/create", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const BULK_CREATE_BILLS = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/bills/bulk-create", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const UPDATE_BILL = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/bills/update", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const DELETE_BILL = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/bills/delete", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const PAY_BILL = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/bills/pay", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const LIST_BILLS = async (params) => {
    try {
        const response = await Axios.get("/api/admin/water-supply/bills/list", { params });
        return {
            data: {
                docs: response.data.data,
                stats: response.data.stats,
                totalDocs: response.data.pagination?.totalItems || 0,
                limit: response.data.pagination?.itemsPerPage || 20,
                page: response.data.pagination?.currentPage || 1,
                totalPages: response.data.pagination?.totalPages || 1
            }
        };
    } catch (error) {
        throw error;
    }
};

// Expenses
export const CREATE_EXPENSE = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/expenses/create", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const UPDATE_EXPENSE = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/expenses/update", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const DELETE_EXPENSE = async (data) => {
    try {
        const response = await Axios.post("/api/admin/water-supply/expenses/delete", data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const LIST_EXPENSES = async (params) => {
    try {
        const response = await Axios.get("/api/admin/water-supply/expenses/list", { params });
        return {
            data: {
                docs: response.data.data,
                totalDocs: response.data.pagination?.totalItems || 0,
                limit: response.data.pagination?.itemsPerPage || 20,
                page: response.data.pagination?.currentPage || 1,
                totalPages: response.data.pagination?.totalPages || 1
            }
        };
    } catch (error) {
        throw error;
    }
};

// Reports
export const GET_FINANCIAL_REPORT = async (params) => {
    try {
        const response = await Axios.get("/api/admin/water-supply/reports", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};
