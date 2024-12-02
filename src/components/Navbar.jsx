import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  UserCircle,
  LogOut,
  Bell,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { OrganizationInfo } from "@/components/ui/actingOrg";
const Navbar = ({ onMenuClick, onSidebarToggle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [orgId, setOrgId] = useState(null); // New state to store organization ID
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const [user, setUser] = useState(null);

  // Fetch user data from localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          setUser(userData);
        } else {
          console.error("User not found. Please log in again.");
        }
      } catch (err) {
        console.error("Error loading profile. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  // Fetch organization ID from localStorage
  useEffect(() => {
    const storedOrgId = localStorage.getItem("custom_org");
    setOrgId(storedOrgId); // Update the state with the stored org ID
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const notifications = [
    { id: 1, text: "New user registration", time: "5m ago", unread: true },
    { id: 2, text: "System update completed", time: "1h ago", unread: false },
    { id: 3, text: "New feedback received", time: "2h ago", unread: true },
  ];

  return (
    <nav className="h-16 px-4 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="flex items-center gap-3">
          {/* Add the logo */}
          <img
            src="src/assets/logo_3-logo-only.png"
            alt="mentorEd logo"
            className="w-5 h-5"
          />
          {/* Add the name */}
          <span className="text-xl font-semibold text-primary-600 dark:text-primary-400 hidden lg:block">
            MentorED
          </span>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="hidden md:block flex-1 max-w-xl mx-4">
        <div
          className={`
          relative transition-all duration-200
          ${searchFocused ? "ring-2 ring-primary-100" : ""}
        `}
        >
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 
                     focus:outline-none focus:border-primary-300 dark:bg-gray-700 dark:text-white
                     dark:placeholder-gray-400"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
{/*         <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-500" />
          ) : (
            <Moon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          )}
        </button> */}

        {/* Organization Info */}
        <div className="flex items-center space-x-2 text-sm">
          <OrganizationInfo orgId={orgId} />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-start gap-3"
                  >
                    <div
                      className={`
                      w-2 h-2 rounded-full mt-2 flex-shrink-0
                      ${
                        notification.unread
                          ? "bg-primary-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }
                    `}
                    />
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {notification.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <img
              src="https://picsum.photos/200"
              alt="User"
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
            />
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
              Hey, {user?.name || "User"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Admin User
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={handleProfile}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                Your Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
