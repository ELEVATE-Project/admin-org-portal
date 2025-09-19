import axiosInstance from './axios'
import { ROLE_API } from './endpoints'

// Get roles by organization
export const getRolesByOrganization = async ({ organizationId, page = 1, limit = 10 }) => {
  const response = await axiosInstance.get(
    ROLE_API.list,
    {
      params: { organization_id: organizationId, page, limit },
    }
  )
  return response.data
}

// Create new role
export const createRole = async (data) => {
  const response = await axiosInstance.post(
    ROLE_API.create,
    data,
  )
  return response.data
}

// Update role
export const updateRole = async (roleId, data) => {
  const response = await axiosInstance.post(
    ROLE_API.update(roleId),
    data,
  )
  return response.data
}

// Delete role
export const deleteRole = async (roleId) => {
  const response = await axiosInstance.delete(
    ROLE_API.delete(roleId)
  )
  return response.data
}