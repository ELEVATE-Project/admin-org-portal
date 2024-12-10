import React from 'react'
import { UserCircle } from 'lucide-react'

const UserAvatar = ({ src, size = 'md', status, className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
  }

  const statusSizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-white p-1`}>
        {src ? (
          <img src={src} alt="User avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center">
            <UserCircle className="w-2/3 h-2/3 text-gray-400" />
          </div>
        )}
      </div>
      {status && (
        <div
          className={`absolute bottom-0 right-0 transform translate-y-1/4 -translate-x-1/4
          ${statusSizes[size]} rounded-full border-4 border-white
          ${
            status === 'online'
              ? 'bg-green-400'
              : status === 'busy'
                ? 'bg-red-400'
                : status === 'away'
                  ? 'bg-yellow-400'
                  : 'bg-gray-400'
          }`}
        />
      )}
    </div>
  )
}

export default UserAvatar
