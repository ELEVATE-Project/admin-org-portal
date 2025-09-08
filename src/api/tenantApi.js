import axiosInstance from './axios'
import { TENANT_API } from './endpoints'

// Get all tenants
export const getAllTenants = async () => {
  const response = await axiosInstance.get(TENANT_API.list)
  return Array.isArray(response.data.result) ? response.data.result : []
}

// Get tenant by code
export const getTenantByCode = async (code) => {
  const response = await axiosInstance.get(TENANT_API.read(code))
  return response.data
}


// Create tenant
export const createOrUpdateTenant = async tenantData => {
  const response = await axiosInstance.post(
    TENANT_API.update,
    tenantData,
  )
  return response.data.result
}

export const updateTenant = async (tenantCode, tenantData) => {
  const response = await axiosInstance.post(
    TENANT_API.updateByCode(tenantCode),
    tenantData,
  )
  return response.data.result
}

// Add domain to tenant
export const addTenantDomain = async (tenantCode, domains) => {
  const response = await axiosInstance.post(
    TENANT_API.addDomain(tenantCode),
    { domains },
  )
  return response.data
}

// Remove domain from tenant
export const removeTenantDomain = async (tenantCode, domains) => {
  const response = await axiosInstance.post(
    TENANT_API.removeDomain(tenantCode),
    { domains },
  )
  return response.data
}
