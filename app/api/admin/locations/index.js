import { Axios } from "@/interceptors";

export async function LIST_LOCATIONS(data) {
  try {
    console.log("===========data", data);
    const response = await Axios.get("/api/admin/location/list", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function GET_LOCATION_BY_TYPE(data) {
  try {
    console.log("===========data", data);
    const response = await Axios.get("/api/admin/location/get-by-type", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function CREATE_LOCATION(data) {
  try {
    const response = await Axios.post("/api/admin/location/create", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function UPDATE_LOCATION(data) {
  try {
    const response = await Axios.post("/api/admin/location/update", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function UPDATE_LOCATION_STATUS(data) {
  try {
    const response = await Axios.post("/api/admin/location/update-status", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function DELETE_LOCATION(data) {
  try {
    const response = await Axios.post("/api/admin/location/delete", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
