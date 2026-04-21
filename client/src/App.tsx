// Login + Auth Components (Don't Touch!)
import { Admin } from "@/components/admin/Admin";
import { CatchAll } from "@/components/CatchAll";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Login } from "@/components/login/Login";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Signup } from "@/components/signup/Signup";

// Playground Components! (Don't Touch!)
import { Playground } from "@/components/playground/Playground";

// Dev-made Components!
import { EventCatalog } from "@/components/eventCatalog/eventCatalog";
import { AdminProfile } from "@/components/adminProfile/adminProfile";
import { AdminLogin } from "@/components/adminProfile/adminLogin";
import { AdminForgotPass } from "./components/adminProfile/adminForgotPass";
import { AdminPassReset } from "./components/adminProfile/adminPassReset";
import { VolunteerManagement } from "./components/volunteerManagement/VolunteerManagement";
import { StaffLayout } from "./components/navbar/StaffLayout";
import { VolunteerLayout } from "./components/navbar/VolunteerLayout";
import { VolunteerProfile } from "@/components/volunteerProfile/volunteerProfile";
import { EmailTemplateManagement } from "@/components/emailTemplateManagement/emailTemplateManagement";
import { VolunteerLogin } from "./components/volunteerLogin/volunteerLogin";
import { TagManagement } from "@/components/tagManagement/tagManagement";
import { EventManagement } from "./components/eventManagement/EventManagement";
import { CreateEvent } from "./components/eventManagement/createEvent";
import { CreatedEvent } from "./components/eventManagement/CreatedEvent";
import { CreateEmailNotification } from "./components/eventManagement/CreateEmailNotification";
// Backend Auth Components (Don't Touch!)
import { AuthProvider } from "@/contexts/AuthContext";
import { BackendProvider } from "@/contexts/BackendContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { CookiesProvider } from "react-cookie";
import { Spinner } from "@chakra-ui/react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAuthContext } from "@/contexts/hooks/useAuthContext";
import { useRoleContext } from "@/contexts/hooks/useRoleContext";

const DashboardLanding = () => {
  const { currentUser } = useAuthContext();
  const { role, loading } = useRoleContext();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (loading) return <Spinner />;

  if (role === "volunteer")
    return <Navigate to="/event-catalog/all-events" replace />;
  if (role === "staff" || role === "supervisor")
    return <Navigate to="/events" replace />;

  return <Dashboard />;
};

const App = () => {
  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            <Router>
              <Routes>
                {/* DEV-MADE ROUTES! */}
                {/* Staff: full AdminNavbar (email, events landing, tags, admin) */}
                <Route
                  element={
                    <ProtectedRoute
                      element={<StaffLayout navbar="expanded" />}
                      allowedRoles={["staff", "supervisor"]}
                    />
                  }
                >
                  <Route
                    path="/email"
                    element={<EmailTemplateManagement />}
                  />
                  <Route
                    path="/email/folder/:folderId"
                    element={<EmailTemplateManagement />}
                  />
                  <Route
                    path="/email/template/:templateId"
                    element={<EmailTemplateManagement />}
                  />
                  <Route path="/events" element={<EventManagement />} />
                  <Route path="/manage-tags/*" element={<TagManagement />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute
                        element={<Admin />}
                        allowedRoles={["staff", "supervisor"]}
                      />
                    }
                  />
                </Route>

                {/* Staff: collapsed sidebar (volunteer management, events sub-pages) */}
                <Route
                  element={
                    <ProtectedRoute
                      element={<StaffLayout navbar="collapsed" />}
                      allowedRoles={["staff", "supervisor"]}
                    />
                  }
                >
                  <Route
                    path="/admin-profile"
                    element={<AdminProfile />}
                  />
                  <Route
                    path="/volunteer-management"
                    element={<VolunteerManagement />}
                  />
                  <Route
                    path="/events/:eventId/email-notification/new"
                    element={<CreateEmailNotification />}
                  />
                  <Route
                    path="/events/:eventId/email-notification/edit/:notificationId"
                    element={<CreateEmailNotification />}
                  />
                  <Route path="/events/:eventId" element={<CreatedEvent />} />
                  <Route path="/events/create" element={<Navigate to="/events/create/header" replace />} />
                  <Route path="/events/create/:tab" element={<CreateEvent />} />
                  <Route path="/events/:eventId/edit/:tab" element={<CreateEvent />} />
                </Route>

                {/* Volunteer shell: catalog + profile */}
                <Route element={<VolunteerLayout />}>
                  <Route
                    path="/event-catalog/*"
                    element={<EventCatalog />}
                  />
                  <Route
                    path="/volunteer-profile"
                    element={
                      <Navigate
                        to="/volunteer-profile/information"
                        replace
                      />
                    }
                  />
                  <Route
                    path="/volunteer-profile/:tab"
                    element={
                      <ProtectedRoute
                        element={<VolunteerProfile />}
                        allowedRoles={["volunteer"]}
                      />
                    }
                  />
                </Route>

                {/* Playground Routes (Don't Touch!) */}
                <Route path="/playground" element={<Playground />} />

                {/* Core Routes (Don't Touch!) */}
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/login/volunteer"
                  element={<VolunteerLogin />}
                />
                <Route
                  path="/login/volunteer/*"
                  element={<VolunteerLogin />}
                />
                <Route
                  path="/login/staff"
                  element={<AdminLogin />}
                />
                <Route path="/adminLogin" element={<AdminLogin />} />
                <Route path="/adminForgotPass" element={<AdminForgotPass />} />
                <Route path="/adminPassReset" element={<AdminPassReset />} />

                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<DashboardLanding />} />}
                />
                <Route
                  path="/"
                  element={<Navigate to="/login" replace />}
                />

                <Route
                  path="*"
                  element={<ProtectedRoute element={<CatchAll />} />}
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
