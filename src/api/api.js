import axiosInstance from "./axios";
import { USER_API } from "./endpoints";

/**
 * User login
 * @param {Object} formData - User login details (email, password)
 * @returns {Promise} API response
 */
export const login = async (formData) => {
  const response = await axiosInstance.post(USER_API.login, formData);
  const { access_token, user } = response.data.result;
  return { access_token, user };
};

/**
 * Create a new user
 * @param {Object} formData - User data to be created
 * @returns {Promise} API response
 */
export const createUser = async (formData) => {
  return await axiosInstance.post(USER_API.createUser, formData);
};

/**
 * Delete a user by ID
 * @param {string} userId - User ID to be deleted
 * @returns {Promise} API response
 */
export const deleteUserFromBoth = async (userId) => {
  await axiosInstance.delete(MENTORING_API.userDelete, {
    params: {
      userId,
    },
  });
  return await axiosInstance.delete(USER_API.deleteUser(userId));
};

/**
 * Add organization admin
 * @param {string} email - User's email to assign as org admin
 * @param {string} orgId - Organization ID
 * @returns {Promise} API response
 */
export const addOrgAdmin = async (email, orgId) => {
  return await axiosInstance.post(USER_API.addOrgAdmin, {
    email,
    organization_id: orgId,
  });
};

/**
 * Deactivate an organization
 * @param {string} orgId - Organization ID
 * @returns {Promise} API response
 */
export const deactivateOrg = async (orgId) => {
  return await axiosInstance.post(USER_API.deactivateOrg(orgId));
};

import { MENTORING_API } from "./endpoints";

/**
 * Fetch profile details
 * @param {string} token - Access token for authorization
 * @returns {Promise} API response
 */
export const getProfile = async () => {
  return await axiosInstance.get(MENTORING_API.profile);
};

/**
 * Delete a user from mentoring
 * @param {string} userId - User ID to be deleted
 * @returns {Promise} API response
 */
export const deleteMentee = async (userId) => {
  return await axiosInstance.delete(MENTORING_API.userDelete, {
    params: {
      userId,
    },
  });
};

/**
 * Get mentees list
 * @param {number} limit - Number of results to fetch
 * @param {number} page - Page number for pagination
 * @param {string} search - Search query for filtering mentees
 * @returns {Promise} API response
 */
export const getMenteesList = async (limit = 50, page = 1, search = "") => {
  // Encode search query in Base64
  const encodedSearch = btoa(search); // Using btoa() for Base64 encoding

  const url = `${MENTORING_API.listMentees}?limit=${limit}&page=${page}&search=${encodedSearch}`;

  return await axiosInstance.get(url); // Make the GET request with the dynamic URL
};

/**
 * List organizations for mentoring
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of results per page
 * @returns {Promise} API response
 */
export const listOrganizations = async (page = 1, limit = 100) => {
  return await axiosInstance.get(
    `${MENTORING_API.organizationList}?page=${page}&limit=${limit}`,
    {
      headers: {
        internal_access_token: "internal_access_token",
      },
    }
  );
};

/**
 * Trigger periodic view refresh for mentoring
 * @returns {Promise} API response
 */
export const triggerPeriodicViewRefresh = async () => {
  return await axiosInstance.get(MENTORING_API.triggerPeriodicViewRefresh);
};
/**
 * Trigger periodic view refresh for user
 * @returns {Promise} API response
 */
export const triggerPeriodicViewRefreshUser = async () => {
  return await axiosInstance.get(USER_API.triggerPeriodicViewRefresh);
};

// Function to create a new organization
/**
 * Create a new organization
 * @param {Object} newOrganization - Organization details to be created
 * @param {string} token - Access token for authorization
 * @returns {Promise} API response
 */
export const createOrg = async (newOrganization) => {
  const organizationData = {
    ...newOrganization,
    // Splitting the domains by comma and trimming spaces for each domain
    domains: newOrganization.domains.split(",").map((domain) => domain.trim()),
  };

  try {
    const response = await axiosInstance.post(
      USER_API.createOrganization, // Assuming USER_API.createOrganization is the correct endpoint
      organizationData
    );

    return response; // Return the response from API
  } catch (error) {
    // Handle error (you can modify this to fit your error handling pattern)
    console.error("Error creating organization:", error);
    throw error; // Rethrow error for handling in the calling function
  }
};
