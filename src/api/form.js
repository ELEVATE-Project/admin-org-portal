import axios from "./axios";

// Fetch all forms
export const fetchForms = async () => {
  try {
    const response = await axios.post("/mentoring/v1/form/read", {}, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching forms", error);
    throw error;
  }
};

// Fetch specific form details by ID
export const fetchFormDetails = async (formId) => {
  try {
    const response = await axios.post(
      `/mentoring/v1/form/read/${formId}`,
      {},
      {}
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching form details for ID ${formId}`, error);
    throw error;
  }
};

// Update form configuration
export const updateForm = async (formId, formData) => {
  try {
    const response = await axios.put(
      `/mentoring/v1/form/update/${formId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating form with ID ${formId}`, error);
    throw error;
  }
};

export const createForm = async (formData) => {
  try {
    const response = await axios.post("/mentoring/v1/form/create", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating form", error);
    throw error;
  }
};

export default {
  fetchForms,
  fetchFormDetails,
  updateForm,
  createForm,
};
