import { Axios } from "@/interceptors";

export async function LIST_CLIENTS(data) {
  try {
    const response = await Axios.post("/api/admin/users/clients/list", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function CREATE_CLIENT(data) {
  try {
    const response = await Axios.post("/api/admin/users/clients/create", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function GET_CLIENT(data) {
  try {
    const response = await Axios.post("/api/admin/users/clients/get", {
      _id: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function UPDATE_CLIENT(data) {
  try {
    const response = await Axios.post("/api/admin/users/clients/update", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
export async function MANAGE_CLIENT_STATUS(data) {
  try {
    const response = await Axios.post(
      "/api/admin/users/clients/active_inactive",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
export async function DELETE_CLIENT(data) {
  try {
    const response = await Axios.post(
      "/api/admin/users/clients/delete",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}