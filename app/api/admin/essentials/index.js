import { Axios } from "@/interceptors";

// Get list of essentials with filters and pagination
export async function GET_ESSENTIALS(data) {
    try {
        const response = await Axios.get("/api/admin/essentials/list", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching essentials:", error);
        throw error;
    }
}

// Create a new essential
export async function CREATE_ESSENTIAL(data) {
    try {
        const response = await Axios.post("/api/admin/essentials/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating essential:", error);
        throw error;
    }
}

// Update an existing essential
export async function UPDATE_ESSENTIAL(data) {
    try {
        const response = await Axios.post("/api/admin/essentials/update", data);
        return response.data;
    } catch (error) {
        console.error("Error updating essential:", error);
        throw error;
    }
}

// Update essential status (active/inactive)
export async function UPDATE_ESSENTIAL_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/essentials/update-status", data);
        return response.data;
    } catch (error) {
        console.error("Error updating essential status:", error);
        throw error;
    }
}

// Delete an essential
export async function DELETE_ESSENTIAL(data) {
    try {
        const response = await Axios.post("/api/admin/essentials/delete", data);
        return response.data;
    } catch (error) {
        console.error("Error deleting essential:", error);
        throw error;
    }
}

// Update essential request status (APPROVED / REJECTED / PENDING)
export async function UPDATE_ESSENTIAL_REQUEST_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/essentials/update-request-status", data);
        return response.data;
    } catch (error) {
        console.error("Error updating essential request status:", error);
        throw error;
    }
}

// Get status counts for essentials (APPROVED / PENDING / REJECTED)
export async function GET_ESSENTIAL_STATUS_COUNTS() {
    try {
        const response = await Axios.get("/api/admin/dashboard/essential-counts");
        return response.data;
    } catch (error) {
        console.error("Error fetching essential status counts:", error);
        throw error;
    }
}

// Upload essential image
export async function UPLOAD_ESSENTIAL_IMAGE(data) {
    try {
        const response = await Axios.post("/api/public/v1/upload-public-image", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading essential image:", error);
        throw error;
    }
}
