import { Axios } from "@/interceptors";

// Get list of places with filters and pagination
export async function GET_PLACES(data) {
    try {
        const response = await Axios.get("/api/admin/places/list", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching places:", error);
        throw error;
    }
}

// Create a new place
export async function CREATE_PLACE(data) {
    try {
        const response = await Axios.post("/api/admin/places/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating place:", error);
        throw error;
    }
}

// Update an existing place
export async function UPDATE_PLACE(data) {
    try {
        const response = await Axios.post("/api/admin/places/update", data);
        return response.data;
    } catch (error) {
        console.error("Error updating place:", error);
        throw error;
    }
}

// Update place status (active/inactive)
export async function UPDATE_PLACE_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/places/update-status", data);
        return response.data;
    } catch (error) {
        console.error("Error updating place status:", error);
        throw error;
    }
}

// Delete a place
export async function DELETE_PLACE(data) {
    try {
        const response = await Axios.post("/api/admin/places/delete", data);
        return response.data;
    } catch (error) {
        console.error("Error deleting place:", error);
        throw error;
    }
}

// Update place request status (APPROVED / REJECTED / PENDING)
export async function UPDATE_PLACE_REQUEST_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/places/update-request-status", data);
        return response.data;
    } catch (error) {
        console.error("Error updating place request status:", error);
        throw error;
    }
}

// Get status counts for places (APPROVED / PENDING / REJECTED)
export async function GET_PLACE_STATUS_COUNTS() {
    try {
        const response = await Axios.get("/api/admin/places/status-counts");
        return response.data;
    } catch (error) {
        console.error("Error fetching place status counts:", error);
        throw error;
    }
}

// Upload place image
export async function UPLOAD_PLACE_IMAGE(data) {
    try {
        const response = await Axios.post("/api/public/v1/upload-public-image", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading place image:", error);
        throw error;
    }
}

