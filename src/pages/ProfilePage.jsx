import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import UserAvatar from '@/components/ui/user-avatar'
import InfoCard from '@/components/ui/info-card'
import {
  UserCircle,
  Mail,
  Star,
  Calendar,
  MapPin,
  Edit,
  Loader2,
  Building,
  Phone,
  Globe,
  GraduationCap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProfileStats = ({ stats }) => (
  <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100">
    {stats.map(({ label, value }) => (
      <div key={label} className="text-center">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    ))}
  </div>
)

const ProfileActions = ({ onEdit }) => (
  <div className="flex gap-3">
    <button
      onClick={onEdit}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg
                 shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                 transition-colors duration-200">
      <Edit className="h-4 w-4 mr-2" />
      Edit Profile
    </button>
    <button
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg
                 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                 transition-colors duration-200">
      <Globe className="h-4 w-4 mr-2" />
      Share Profile
    </button>
  </div>
)

const ProfileBadge = ({ status }) => (
  <span
    className={`
    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
    ${
      status === 'active'
        ? 'bg-green-100 text-green-800'
        : status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-gray-100 text-gray-800'
    }
  `}>
    <div
      className={`
      w-2 h-2 rounded-full mr-2
      ${
        status === 'active'
          ? 'bg-green-400'
          : status === 'pending'
            ? 'bg-yellow-400'
            : 'bg-gray-400'
      }
    `}
    />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
)

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        console.log(userData)
        if (userData) {
          setUser(userData)
        } else {
          setError('User not found. Please log in again.')
        }
      } catch (err) {
        setError('Error loading profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="bg-red-50 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Profile</h3>
            <p className="text-red-700">{error}</p>
            <button
              className="mt-4 w-full inline-flex justify-center px-4 py-2 text-sm font-medium 
                         text-red-700 bg-red-100 border border-transparent rounded-md 
                         hover:bg-red-200 focus:outline-none focus-visible:ring-2 
                         focus-visible:ring-offset-2 focus-visible:ring-red-500
                         transition-colors duration-200"
              onClick={() => navigate('/login')}>
              Return to Login
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const stats = [
    { label: 'Projects', value: '12' },
    { label: 'Team Members', value: '48' },
    { label: 'Contributions', value: '156' },
  ]

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-xl overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600 relative">
            <div className="absolute -bottom-16 left-8">
              <UserAvatar
                src={user.avatar_url || 'https://picsum.photos/200'}
                size="lg"
                status="online"
              />
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-500">
                  <div className="space-y-1">
                    {user.user_roles.map(role => (
                      <span
                        key={role.id}
                        className="inline-block px-2 py-1 text-xs font-medium bg-primary-50 
                text-primary-700 rounded-md mr-2">
                        {role.title.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </p>
              </div>
              <ProfileActions onEdit={() => console.log('Edit profile')} />
            </div>
            <div>---</div>
            {/* Stats Section */}
            <ProfileStats stats={stats} />

            {/* Details Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InfoCard icon={Mail} label="Email" value={`${user.email}`} />
              <InfoCard
                icon={Star}
                label="Roles"
                value={
                  <div className="space-y-1">
                    {user?.designation.map(role => (
                      <span
                        key={role.id}
                        className="inline-block px-2 py-1 text-xs font-medium bg-primary-50 
                text-primary-700 rounded-md mr-2">
                        {role.label.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                }
              />
              <InfoCard
                icon={Calendar}
                label="Joined"
                value={new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(user.created_at))}
              />
              <InfoCard
                icon={MapPin}
                label="Location"
                value={user?.location?.label || 'Not specified'}
              />
              <InfoCard
                icon={GraduationCap}
                label="Education Qualification"
                value={user.education_qualification || 'Not specified'}
              />
              <InfoCard icon={Phone} label="Contact" value={user.phone || 'Not specified'} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage
