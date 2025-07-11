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

  const navigationItems = [
    {
      label: 'Home',
      icon: Home,
      path: '/dashboard',
    },
    {
      label: 'My Profile',
      icon: UserCircle,
      path: '/profile',
    },
    {
      label: 'All Users',
      icon: Users,
      path: '/users',
    },
     {
    label: 'Tenants',
    icon: Users,
    path: '/tenants',
  },
    {
      label: 'Entity Types',
      icon: LayoutList,
      path: '/entity',
    },

    {
      label: 'Forms',
      icon: FileText,
      path: '/forms',
    },
    {
      label: 'Notification Templates',
      icon: Bell,
      path: '/notification-templates',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ]

  const NavItem = ({ icon: Icon, label, path, onClick }) => {
    const isActive = location.pathname === path

    return (
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200
          ${
            isActive
              ? 'bg-primary-50 text-primary-900 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }
          ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'}
        `}>
        <Icon
          className={`flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-500'}`}
          size={20}
        />
        {!isCollapsed && <span className="truncate">{label}</span>}
        {isActive && !isCollapsed && (
          <ChevronRight className="ml-auto flex-shrink-0 text-primary-600" size={16} />
        )}
      </button>
    )
  }

  return (
    <div
      className={`
      flex flex-col h-full w-full bg-white
      ${isCollapsed ? 'items-center' : 'items-stretch'}
      ${isCollapsed ? 'px-1' : 'px-2'}
    `}>
      <nav className="flex-1 w-full space-y-1 mt-4">
        {navigationItems.map(item => (
          <NavItem key={item.path} {...item} onClick={() => navigate(item.path)} />
        ))}
      </nav>

      <div
        className={`
        mt-auto mb-6 w-full space-y-1
        ${isCollapsed ? 'px-1' : 'px-2'}
      `}>
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-2 p-2 rounded-lg
            text-red-600 hover:bg-red-50 transition-colors
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}>
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
