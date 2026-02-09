import { Axios } from "@/interceptors";

// Get list of email templates with filters and pagination
export async function GET_EMAIL_TEMPLATES(params) {
  try {
    const response = await Axios.get("/api/admin/settings/email-templates/list", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching email templates:", error);
    throw error;
  }
}

// Get single email template details
export async function GET_EMAIL_TEMPLATE(params) {
  try {
    const response = await Axios.get("/api/admin/settings/email-templates/get", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
}

// Create a new email template
export async function CREATE_EMAIL_TEMPLATE(data) {
  try {
    const response = await Axios.post("/api/admin/settings/email-templates/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating email template:", error);
    throw error;
  }
}

// Update an existing email template
export async function UPDATE_EMAIL_TEMPLATE(data) {
  try {
    const response = await Axios.post("/api/admin/settings/email-templates/update", data);
    return response.data;
  } catch (error) {
    console.error("Error updating email template:", error);
    throw error;
  }
}

// Update email template status (active/inactive)
export async function UPDATE_EMAIL_TEMPLATE_STATUS(data) {
  try {
    const response = await Axios.post("/api/admin/settings/email-templates/update-status", data);
    return response.data;
  } catch (error) {
    console.error("Error updating email template status:", error);
    throw error;
  }
}

// Delete an email template
export async function DELETE_EMAIL_TEMPLATE(data) {
  try {
    const response = await Axios.post("/api/admin/settings/email-templates/remove", data);
    return response.data;
  } catch (error) {
    console.error("Error deleting email template:", error);
    throw error;
  }
}
