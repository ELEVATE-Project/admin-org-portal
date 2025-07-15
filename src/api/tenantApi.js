import axios from 'axios'
const BASE_URL = 'https://dev.elevate-apis.shikshalokam.org'

// Get all tenants
export const getAllTenants = async () => {
  const response = await axios.get(`${BASE_URL}/user/v1/tenant/list`, {
    headers: {
      'x-auth-token': localStorage.getItem('access_token'),
      'x-tenant': 'mentoring',
    },
  })
  return response.data.result
}

// Get tenant by code
export const getTenantByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/v1/tenant/read/${code}`, {
      headers: {
        'x-auth-token': localStorage.getItem('access_token'),
        'x-tenant': 'mentoring',
      },
    })
    return response.data
  } catch (error) {
    console.error('❌ Failed to fetch tenant details:', error?.response?.data || error.message)
    return null
  }
}


// Create tenant
export const createOrUpdateTenant = async tenantData => {
  try {

    console.log('📤 Sending tenantData:', tenantData);

    const response = await axios.post(
      `${BASE_URL}/user/v1/tenant/update`,
      tenantData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('access_token'),
          'x-tenant': 'mentoring',
        },
      }
    )
    return response.data.result
  } catch (error) {
    console.error('❌ Failed to create tenant:', error)
    throw error
  }
}

export const updateTenant = async (tenantCode, tenantData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/v1/tenant/update/${tenantCode}`,
      tenantData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('access_token'),
          'x-tenant': 'mentoring',
        },
      }
    )
    return response.data.result
  } catch (error) {
    console.error('❌ Failed to update tenant:', error)
    throw error
  }
}
