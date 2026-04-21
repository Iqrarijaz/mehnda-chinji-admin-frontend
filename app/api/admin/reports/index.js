import { Axios } from "@/interceptors";

// Get list of reports with filters and pagination
export async function GET_REPORTS(data) {
    try {
        const response = await Axios.get("/api/admin/reports/list", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error;
    }
}

// Get single report details
export async function GET_REPORT(data) {
    try {
        const response = await Axios.get("/api/admin/reports/get", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching report:", error);
        throw error;
    }
}

// Update report status (PENDING / REVIEWED / RESOLVED)
export async function UPDATE_REPORT_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/reports/update-status", data);
        return response.data;
    } catch (error) {
        console.error("Error updating report status:", error);
        throw error;
    }
}

// Get status counts for reports
export async function GET_REPORT_STATUS_COUNTS() {
    try {
        const response = await Axios.get("/api/admin/dashboard/report-counts");
        return response.data;
    } catch (error) {
        console.error("Error fetching report status counts:", error);
        throw error;
    }
}

// Get pending reports for notifications
export async function GET_REPORTS_NOTIFICATIONS_PENDING() {
    try {
        const response = await Axios.get("/api/admin/reports/notifications/pending");
        return response.data;
    } catch (error) {
        console.error("Error fetching pending reports:", error);
        throw error;
    }
}
