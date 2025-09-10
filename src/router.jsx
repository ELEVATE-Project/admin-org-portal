// src/router.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import UserListPage from './pages/AllUsersPage'
import EntityManagementPage from './pages/EntityManagementPage'
import FormsManagementPage from './pages/FormsManagementPage'
import NotificationTemplateManagement from './pages/NotificationTemplateManagement'
import TenantsPage from './pages/Tenant/TenantsPage'
import TenantDetail from '@/pages/Tenant/TenantDetail'
import OrganizationsListPage from '@/pages/Organization/OrganizationsListPage'
import OrganizationDetailsPage from './pages/Organization/OrganizationDetailsPage'
// DO NOT import OrganizationCreateModal here

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace={true} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/entity" element={<EntityManagementPage />} />
        <Route path="/forms" element={<FormsManagementPage />} />
        <Route path="/notification-templates" element={<NotificationTemplateManagement />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/tenants/:code" element={<TenantDetail />} />
        <Route path="/tenants/organizations" element={<OrganizationsListPage />} />
        <Route path="/organizations/:id" element={<OrganizationDetailsPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default AppRouter