import { Axios } from "@/interceptors";

export async function GET_ALL_DASHBOARD_STATS() {
    try {
        const response = await Axios.get("/api/admin/dashboard/all-stats");
        return response.data;
    } catch (error) {
        console.error("Error fetching all dashboard stats:", error);
        throw error;
    }
}

export async function GET_COMMUNITY_STATS() {
    try {
        const response = await Axios.get("/api/admin/dashboard/community-stats");
        return response.data;
    } catch (error) {
        console.error("Error fetching community stats:", error);
        throw error;
    }
}

export async function GET_MARKETPLACE_STATS() {
    try {
        const response = await Axios.get("/api/admin/dashboard/marketplace-stats");
        return response.data;
    } catch (error) {
        console.error("Error fetching marketplace stats:", error);
        throw error;
    }
}

export async function GET_SUPPORT_STATS() {
    try {
        const response = await Axios.get("/api/admin/dashboard/support-stats");
        return response.data;
    } catch (error) {
        console.error("Error fetching support stats:", error);
        throw error;
    }
}
