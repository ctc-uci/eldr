import { Admin } from "@/components/admin/Admin";
import { AdminProfile } from "@/components/adminProfile/adminProfile";
import { CatchAll } from "@/components/CatchAll";
import { AdminLogin } from "@/components/adminProfile/adminLogin";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { VolunteerManagement } from "./components/volunteerManagement/VolunteerManagement";
import { Login } from "@/components/login/Login";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Signup } from "@/components/signup/Signup";
import { EmailTemplateManagement } from "@/components/emailTemplateManagement/emailTemplateManagement";
import { EventManagement } from "@/components/eventManagement/EventManagement.jsx";
import { EventDetail } from "@/components/eventManagement/EventDetail.jsx";
import { AuthProvider } from "@/contexts/AuthContext";
import { BackendProvider } from "@/contexts/BackendContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { CookiesProvider } from "react-cookie";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import VolunteerLogin from "./components/volunteerLogin/VolunteerLogin";

const App = () => {
  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            <Router>
              <Routes>
                <Route
                  path="/adminLogin"
                  element={<AdminLogin />}
                />
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/email"
                  element={<ProtectedRoute element={<EmailTemplateManagement />} />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
                />
                <Route
                  path="/volunteer-management"
                  element={<ProtectedRoute element={<VolunteerManagement />} />}
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute
                    element={<Admin />}
                    allowedRoles={["admin"]}
                    />
                  }
                />
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/login"
                      replace
                    />
                  }
                />
                <Route
                  path="/admin-profile"
                  element={<AdminProfile />}
                />
                <Route
                  path="*"
                  element={<ProtectedRoute element={<CatchAll />} />}
                />
                <Route
                  path = "/events"
                  element={
                    <ProtectedRoute
                      element={<EventManagement />}
                      allowedRoles={["admin"]}
                    />
                  }
                />
                <Route
                  path = "/events/:id"
                  element={
                    <ProtectedRoute
                      element={<EventDetail />}
                      allowedRoles={["admin"]}
                    />
                  }
                />
                <Route
                  path="/volunteerLogin"
                  element={<VolunteerLogin />}
                />
              </Routes>
            </Router>
          </RoleProvider>
        </AuthProvider>
      </BackendProvider>
    </CookiesProvider>
  );
};

export default App;
