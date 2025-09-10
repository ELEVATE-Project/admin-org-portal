// src/api/apiEndpoints.js

export const USER_API = {
  login: '/user/v1/admin/login',
  logout: '/user/v1/account/logout',
  createUser: '/user/v1/admin/create',
  deleteUser: userId => `/user/v1/admin/deleteUser/${userId}`,
  addOrgAdmin: '/user/v1/admin/addOrgAdmin',
  deactivateOrg: orgId => `/user/v1/admin/deactivateOrg/${orgId}`,
  triggerPeriodicViewRefresh: '/user/v1/admin/triggerPeriodicViewRefresh',
  createOrganization: '/user/v1/organization/create',
}

export const MENTORING_API = {
  profile: '/interface/v1/profile/read',
  userDelete: '/mentoring/v1/admin/userDelete',
  listMentees: '/mentoring/v1/mentees/list',
  organizationList: '/user/v1/organization/list',
  triggerPeriodicViewRefresh: '/mentoring/v1/admin/triggerPeriodicViewRefresh',
}

export const TENANT_API = {
  list: '/user/v1/tenant/list',
  read: code => `/user/v1/tenant/read/${code}`,
  update: '/user/v1/tenant/update',
  updateByCode: tenantCode => `/user/v1/tenant/update/${tenantCode}`,
  addDomain: tenantCode => `/user/v1/tenant/addDomain/${tenantCode}`,
  removeDomain: tenantCode => `/user/v1/tenant/removeDomain/${tenantCode}`,
}

export const ORGANIZATION_API = {
  list: '/user/v1/organization/list',
  read: '/user/v1/organization/read',
  update: organizationId => `/user/v1/organization/update/${organizationId}`,
  create: '/user/v1/organization/create',
}