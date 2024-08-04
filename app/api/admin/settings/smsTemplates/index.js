import { Axios } from "@/interceptors";

export async function GET_SMS_TEMPLATES(data) {
  try {
    const response = await Axios.post("/api/admin/settings/sms_templates/get", {_id:data});
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}export async function LIST_SMS_TEMPLATES(data) {
  try {
    const response = await Axios.post("/api/admin/settings/sms_templates/list", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}


export async function UPDATE_SMS_TEMPLATE(data) {
  try {
    const response = await Axios.post("/api/admin/settings/sms_templates/update", data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function CREATE_SMS_TEMPLATE(data) {
  try {
    const response = await Axios.post(
      "/api/admin/settings/sms_templates/create",
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
