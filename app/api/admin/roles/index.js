import { Axios } from "@/interceptors";

// Dummy data for simulation
let DUMMY_ROLES = [
    { _id: "1", name: "Super Admin", description: "Full access to all modules" },
    { _id: "2", name: "Manager", description: "Can manage content and users" },
    { _id: "3", name: "Editor", description: "Can edit content only" },
];

export async function GET_ROLES(params) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate filtering/searching if needed, for now return all
    return {
        data: {
            docs: DUMMY_ROLES,
            totalDocs: DUMMY_ROLES.length,
            limit: params.itemsPerPage || 10,
            page: params.currentPage || 1,
            totalPages: 1
        }
    };
}

export async function CREATE_ROLE(data) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newRole = { _id: Date.now().toString(), ...data };
    DUMMY_ROLES.unshift(newRole);
    return { data: newRole, message: "Role created successfully" };
}

export async function UPDATE_ROLE(data) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    DUMMY_ROLES = DUMMY_ROLES.map(role => role._id === data._id ? { ...role, ...data } : role);
    return { data, message: "Role updated successfully" };
}

export async function DELETE_ROLE(data) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    DUMMY_ROLES = DUMMY_ROLES.filter(role => role._id !== data._id);
    return { message: "Role deleted successfully" };
}
