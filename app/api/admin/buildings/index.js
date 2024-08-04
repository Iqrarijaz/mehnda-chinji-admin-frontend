import { Axios } from "@/interceptors";

export async function LIST_BUILDINGS(data) {
  try {
    const response = await Axios.post("/api/admin/buildings/list", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
export async function LIST_CLIENTS_FOR_ADDING_BUILDING(data) {
  try {
    const response = await Axios.post(
      "/api/admin/buildings/list_clients_for_adding_building",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function CREATE_BUILDING(data) {
  try {
    const response = await Axios.post("/api/admin/buildings/create", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function GET_BUILDING(data) {
  try {
    const response = await Axios.post("/api/admin/buildings/get", {
      _id: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function MANAGE_BUILDING_STATUS(data) {
  try {
    const response = await Axios.post(
      "/api/admin/buildings/active_inactive",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function GET_BUILDING_DETAILS(data) {
  try {
    const response = await Axios.post("/api/admin/buildings/get_details", {
      _id: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function UPDATE_BUILDING(data) {
  try {
    const response = await Axios.post("/api/admin/buildings/update", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function DELETE_BUILDING(data) {
  try {
    const response = await Axios.post("/api/admin/buildings/delete", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
