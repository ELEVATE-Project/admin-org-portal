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
