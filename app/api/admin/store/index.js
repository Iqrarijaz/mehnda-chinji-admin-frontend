import { Axios } from "@/interceptors";

export async function GET_STORE_DASHBOARD_STATS(businessId) {
    try {
        const response = await Axios.get("/api/admin/store/dashboard/stats", {
            params: { businessId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching store dashboard stats:", error);
        throw error;
    }
}

export async function GET_CATEGORIES(businessId) {
    try {
        const response = await Axios.get("/api/admin/store/categories/list", {
            params: { businessId }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

export async function CREATE_CATEGORY(data) {
    try {
        const response = await Axios.post("/api/admin/store/categories/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

export async function UPDATE_CATEGORY({ id, data }) {
    try {
        const response = await Axios.post(`/api/admin/store/categories/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}

export async function DELETE_CATEGORY(id) {
    try {
        const response = await Axios.post(`/api/admin/store/categories/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}

export async function GET_PRODUCTS(filters) {
    try {
        const response = await Axios.get("/api/admin/store/products/list", {
            params: filters
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export async function CREATE_PRODUCT(data) {
    try {
        const response = await Axios.post("/api/admin/store/products/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

export async function UPDATE_PRODUCT({ id, data }) {
    try {
        const response = await Axios.post(`/api/admin/store/products/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

export async function DELETE_PRODUCT(id) {
    try {
        const response = await Axios.post(`/api/admin/store/products/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

export async function GET_ORDERS(filters) {
    try {
        const response = await Axios.get("/api/admin/store/orders/list", {
            params: filters
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

export async function GET_ORDER(id) {
    try {
        const response = await Axios.get(`/api/admin/store/orders/get/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
}

export async function UPDATE_ORDER_STATUS({ id, status, note }) {
    try {
        const response = await Axios.post(`/api/admin/store/orders/update-status/${id}`, { status, note });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}
