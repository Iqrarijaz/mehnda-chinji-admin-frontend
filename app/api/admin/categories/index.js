import { Axios } from "@/interceptors";

export async function CATEGORIES(data) {
  try {
    console.log("===========data", data);
    const response = await Axios.get("/api/admin/business-category/list", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}


export async function CREATE_BUSINESS_CATEGORY(data) {
  try {
    const response = await Axios.post("/api/admin/business-category/create", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function GET_BUILDING(data) {
  try {
    const response = await Axios.get("/api/admin/buildings/get", {
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

export async function UPDATE_BUSINESS_CATEGORY(data) {
  try {
    const response = await Axios.post("/api/admin/business-category/update", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function UPDATE_BUSINESS_CATEGORY_STATUS(data) {
  try {
    const response = await Axios.post("/api/admin/business-category/update-status", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function DELETE_BUSINESS_CATEGORY(data) {
  try {
    const response = await Axios.post("/api/admin/business-category/delete", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
