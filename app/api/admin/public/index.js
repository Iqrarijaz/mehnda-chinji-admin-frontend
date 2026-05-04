import { Axios } from "@/interceptors";

export async function UPLOAD_PUBLIC_IMAGE(formData) {
    try {
        const response = await Axios.post("/api/public/v1/upload-public-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading public image:", error);
        throw error;
    }
}
