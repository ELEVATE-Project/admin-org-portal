import axiosInstance from './axios'

export const getOrganizationsByTenant = async ({ tenantCode, page = 1, limit = 10 }) => {
  const response = await axiosInstance.get(
    `/user/v1/organization/list`,
    {
      params: { tenantCode, page, limit },
    }
  )
  return response.data
}

// Get organization details
export const readOrganization = async (organizationId) => {
  const response = await axiosInstance.get(
    `/user/v1/organization/read`,
    {
      params: { organisation_id: organizationId },
      headers: {
        internal_access_token: import.meta.env.VITE_INTERNAL_ACCESS_TOKEN, // store in .env
      },
    }
  )
  return response.data
}

// Update organization
export const createOrganization = async (organizationId, data) => {
  const token = localStorage.getItem('token') // or however you store it
  const response = await axiosInstance.patch(
    `/user/v1/organization/update/${organizationId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

// Create new organization
export const createNewOrganization = async (data) => {
  const token = localStorage.getItem('token') // or however you store it
  const response = await axiosInstance.post(
    '/user/v1/organization/create',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}