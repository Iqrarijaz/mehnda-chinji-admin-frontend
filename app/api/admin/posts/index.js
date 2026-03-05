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

// Upload post images
export async function UPLOAD_POST_IMAGES(data) {
    try {
        const response = await Axios.post("/api/admin/posts/upload-images", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading post images:", error);
        throw error;
    }
}

// Delete post image
export async function DELETE_POST_IMAGE(data) {
    try {
        const response = await Axios.post("/api/admin/posts/delete-image", data);
        return response.data;
    } catch (error) {
        console.error("Error deleting post image:", error);
        throw error;
    }
}

// Get list of users who liked a post
export async function GET_POST_LIKES(data) {
    try {
        const response = await Axios.get("/api/admin/posts/likes", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching post likes:", error);
        throw error;
    }
}

// Get list of comments for a post
export async function GET_POST_COMMENTS(data) {
    try {
        const response = await Axios.get("/api/admin/posts/comments", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching post comments:", error);
        throw error;
    }
}

// Delete a comment
export async function DELETE_POST_COMMENT(data) {
    try {
        const response = await Axios.post("/api/admin/posts/delete-comment", data);
        return response.data;
    } catch (error) {
        console.error("Error deleting post comment:", error);
        throw error;
    }
}
