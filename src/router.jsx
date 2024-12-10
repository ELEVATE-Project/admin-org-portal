// src/router.js
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import UserListPage from "./pages/AllUsersPage";
import EntityManagementPage from "./pages/EntityManagementPage";
import FormsManagementPage from "./pages/FormsManagementPage";
import NotificationTemplateManagement from "./pages/NotificationTemplateManagement";

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
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
