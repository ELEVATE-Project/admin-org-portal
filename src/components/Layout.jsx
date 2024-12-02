import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react"; // Using lucide-react which is already installed

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    console.log("Inside::::::::::::::::::::::;");
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <Navbar
            onMenuClick={toggleMobileMenu}
            onSidebarToggle={toggleSidebar}
          />
        </div>

        {/* Mobile sidebar backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Main content */}
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div
            className={`
            fixed inset-y-0 z-30 flex-shrink-0 w-64 bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-20"}
            ${
              isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <div className="flex items-center justify-between h-16 px-4 lg:hidden">
              <span className="text-xl font-semibold">Menu</span>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <Sidebar isCollapsed={!isSidebarOpen} />
          </div>

          {/* Main content area */}
          <main
            className={`
            flex-1 overflow-y-auto p-6 transition-all duration-200
          `}
          >
            <div className="container mx-auto max-w-7xl">
              {/* Desktop menu toggle */}
              <button
                onClick={toggleSidebar}
                className="fixed bottom-4 left-4 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Page content */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

export default Layout;
