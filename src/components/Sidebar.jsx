import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  UserCircle,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  LayoutList,
  FileText,
  Bell,
} from 'lucide-react'
import { logout } from '../api/api'

const Sidebar = ({ isCollapsed = false }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout(localStorage.getItem('access_token'), localStorage.getItem('refresh_token'))
    localStorage.clear()
    navigate('/login')
  }

  const isPathActive = path => location.pathname === path

  const NavItem = ({ icon: Icon, label, path, onClick, active }) => (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200
        ${active ? 'bg-primary-50 text-primary-900 font-medium' : 'text-gray-700 hover:bg-gray-100'}
        ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'}
      `}
    >
      <Icon className={`${active ? 'text-primary-600' : 'text-gray-500'}`} size={20} />
      {!isCollapsed && <span className="truncate">{label}</span>}
      {active && !isCollapsed && (
        <ChevronRight className="ml-auto text-primary-600" size={16} />
      )}
    </button>
  )

  return (
    <div
      className={`
        flex flex-col h-full w-full bg-white
        ${isCollapsed ? 'items-center' : 'items-stretch'}
        ${isCollapsed ? 'px-1' : 'px-2'}
      `}
    >
      <nav className="flex-1 w-full space-y-1 mt-4">
        <NavItem
          icon={Home}
          label="Home"
          path="/dashboard"
          active={isPathActive('/dashboard')}
          onClick={() => navigate('/dashboard')}
        />
        <NavItem
          icon={UserCircle}
          label="My Profile"
          path="/profile"
          active={isPathActive('/profile')}
          onClick={() => navigate('/profile')}
        />
        <NavItem
          icon={Users}
          label="All Users"
          path="/users"
          active={isPathActive('/users')}
          onClick={() => navigate('/users')}
        />

        {/* Tenants (Parent) */}
        <NavItem
          icon={Users}
          label="Tenants"
          path="/tenants"
          active={isPathActive('/tenants')}
          onClick={() => navigate('/tenants')}
        />

        {/* Organizations (Child of Tenants) */}
        {!isCollapsed && (
          <button
            onClick={() => navigate('/tenants/organizations')}
            className={`
              w-full flex items-center gap-2 py-1.5 px-6 text-sm rounded-lg transition-colors duration-200
              ${
                isPathActive('/tenants/organizations')
                  ? 'bg-primary-50 text-primary-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <Users
              size={16}
              className={`flex-shrink-0 ${
                isPathActive('/tenant-organizations') ? 'text-primary-600' : 'text-gray-500'
              }`}
            />
            <span className="truncate">Organizations</span>
            {isPathActive('/tenant-organizations') && (
              <ChevronRight size={14} className="ml-auto text-primary-600" />
            )}
          </button>
        )}

        {/* Remaining nav items */}
        <NavItem
          icon={LayoutList}
          label="Entity Types"
          path="/entity"
          active={isPathActive('/entity')}
          onClick={() => navigate('/entity')}
        />
        <NavItem
          icon={FileText}
          label="Forms"
          path="/forms"
          active={isPathActive('/forms')}
          onClick={() => navigate('/forms')}
        />
        <NavItem
          icon={Bell}
          label="Notification Templates"
          path="/notification-templates"
          active={isPathActive('/notification-templates')}
          onClick={() => navigate('/notification-templates')}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          path="/settings"
          active={isPathActive('/settings')}
          onClick={() => navigate('/settings')}
        />
      </nav>

      <div className={`mt-auto mb-6 w-full ${isCollapsed ? 'px-1' : 'px-2'}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
