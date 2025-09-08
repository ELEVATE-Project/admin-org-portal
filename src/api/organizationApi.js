import axiosInstance from './axios'
import { ORGANIZATION_API } from './endpoints'

export const getOrganizationsByTenant = async ({ tenantCode, page = 1, limit = 10 }) => {
  const response = await axiosInstance.get(
    ORGANIZATION_API.list,
    {
      params: { tenantCode, page, limit },
    }
  )
  return response.data
}

// Get organization details
export const readOrganization = async (organizationId) => {
  const response = await axiosInstance.get(
    ORGANIZATION_API.read,
    {
      params: { organisation_id: organizationId },
      headers: {
        internal_access_token: import.meta.env.VITE_INTERNAL_ACCESS_TOKEN,
      },
    }
  )
  return response.data
}

// Update organization
export const createOrganization = async (organizationId, data) => {
  const response = await axiosInstance.patch(
    ORGANIZATION_API.update(organizationId),
    data,
  )
  return response.data
}

// Create new organization
export const createNewOrganization = async (data) => {
  const response = await axiosInstance.post(
    ORGANIZATION_API.create,
    data,
  )
  return response.data
}