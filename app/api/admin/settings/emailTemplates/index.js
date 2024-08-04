import { Axios } from "@/interceptors";

export async function LIST_EMAIL_TEMPLATES(data) {
  try {
    const response = await Axios.post("/api/admin/settings/email_templates/list", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function GET_EMAIL_TEMPLATE(data) {
  try {
    const response = await Axios.post("/api/admin/settings/email_templates/get", {
      _id: data,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function UPDATE_EMAIL_TEMPLATE(data) {
  try {
    const response = await Axios.post("/api/admin/settings/email_templates/update", data);
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
