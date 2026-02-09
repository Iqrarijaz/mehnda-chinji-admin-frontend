import { Axios } from "@/interceptors";

// Get list of posts with filters and pagination
export async function GET_POSTS(data) {
    try {
        const response = await Axios.get("/api/admin/posts/list", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

// Get single post details
export async function GET_POST(data) {
    try {
        const response = await Axios.get("/api/admin/posts/get", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
}

// Create a new post
export async function CREATE_POST(data) {
    try {
        const response = await Axios.post("/api/admin/posts/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

// Update an existing post
export async function UPDATE_POST(data) {
    try {
        const response = await Axios.post("/api/admin/posts/update", data);
        return response.data;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

// Update post status (active/inactive)
export async function UPDATE_POST_STATUS(data) {
    try {
        const response = await Axios.post("/api/admin/posts/update-status", data);
        return response.data;
    } catch (error) {
        console.error("Error updating post status:", error);
        throw error;
    }
}

// Delete a post
export async function DELETE_POST(data) {
    try {
        const response = await Axios.post("/api/admin/posts/remove", data);
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}
