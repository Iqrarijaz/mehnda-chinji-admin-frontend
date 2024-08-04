import { Axios } from "@/interceptors";

export async function LIST_TENANTS(data) {
  try {
    const response = await Axios.post("/api/admin/users/tenants/list", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function CREATE_TENANT(data) {
  try {
    const response = await Axios.post("/api/admin/users/tenants/create", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function GET_TENANT(data) {
  try {
    const response = await Axios.post("/api/admin/users/tenants/get", {
      _id: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function UPDATE_TENANT(data) {
  try {
    const response = await Axios.post("/api/admin/users/tenants/update", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function MANAGE_TENANT_STATUS(data) {
  try {
    const response = await Axios.post(
      "/api/admin/users/tenants/active_inactive",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function DELETE_TENANT(data) {
  try {
    const response = await Axios.post("/api/admin/users/tenants/delete", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
