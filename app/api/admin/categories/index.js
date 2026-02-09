import { Axios } from "@/interceptors";

export async function CATEGORIES(data) {
  try {
    console.log("===========data", data);
    const response = await Axios.get("/api/admin/category/list", {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}


export async function CREATE_CATEGORY(data) {
  try {
    const response = await Axios.post("/api/admin/category/create", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}





export async function UPDATE_CATEGORY(data) {
  try {
    const response = await Axios.post("/api/admin/category/update", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function UPDATE_CATEGORY_STATUS(data) {
  try {
    const response = await Axios.post("/api/admin/category/update-status", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function DELETE_CATEGORY(data) {
  try {
    const response = await Axios.post("/api/admin/category/delete", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
