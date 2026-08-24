import { Axios } from "@/interceptors";

export async function GET_CONFIGURATIONS(data) {
    try {
        const response = await Axios.get("/api/admin/configuration/list", {
            params: data,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching configurations:", error);
        throw error;
    }
}

export async function CREATE_CONFIGURATION(data) {
    try {
        const response = await Axios.post("/api/admin/configuration/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating configuration:", error);
        throw error;
    }
}

export async function UPDATE_CONFIGURATION(data) {
    try {
        const response = await Axios.post("/api/admin/configuration/update", data);
        return response.data;
    } catch (error) {
        console.error("Error updating configuration:", error);
        throw error;
    }
}

/**
 * Patch a single entry inside a configuration array, addressed by id.
 *
 * Preferred over UPDATE_CONFIGURATION for one-field edits: it sends only the
 * entry being changed, so a stale tab cannot undo another admin's work by
 * saving the whole document it loaded minutes ago.
 *
 * @param {{ type?: string, _id?: string, section: "categories"|"moreCategories"|"utilities",
 *           itemId: string, groupId?: string, patch: object }} data
 */
export async function UPDATE_CONFIGURATION_ITEM(data) {
    try {
        const response = await Axios.post("/api/admin/configuration/update-item", data);
        return response.data;
    } catch (error) {
        console.error("Error updating configuration item:", error);
        throw error;
    }
}

export async function DELETE_CONFIGURATION(id) {
    try {
        const response = await Axios.post(`/api/admin/configuration/remove/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting configuration:", error);
        throw error;
    }
}
