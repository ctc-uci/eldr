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
// import { AdminProfile } from "@/components/adminProfile/adminProfile";
// import { EventCatalog } from "@/components/eventCatalog/eventCatalog";
import { AdminLogin } from "@/components/adminProfile/adminLogin";
import { AdminForgotPass } from "./components/adminProfile/adminForgotPass";
// import { VolunteerManagement } from "./components/volunteerManagement/VolunteerManagement";
// import { VolunteerProfile } from "@/components/volunteerProfile/volunteerProfile";
// import { VolunteerLogin } from "./components/volunteerLogin/VolunteerLogin";
// import { EmailTemplateManagement } from "@/components/emailTemplateManagement/emailTemplateManagement";
// import { EventManagement } from "@/components/eventManagement/EventManagement.jsx";
// import { EventDetail } from "@/components/eventManagement/EventDetail.jsx";
// import { CaseCatalog } from "@/components/caseCatalog/CaseCatalog.jsx";
// import { CaseManagement } from "./components/caseManagement/CaseManagement";

// Backend Auth Components (Don't Touch!)
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


const App = () => {
  return (
    <CookiesProvider>
      <BackendProvider>
        <AuthProvider>
          <RoleProvider>
            <Router>
              <Routes>
                {/* Dev-made Routes! */}
                <Route
                  path="/adminLogin"
                  element={<AdminLogin/>}
                />
                <Route
                  path = "/adminForgotPass"
                  element = {<AdminForgotPass/>}
                >
                </Route>
                
                {/* <Route
                  path="/volunteerProfile"
                  element={<VolunteerProfile />}
                /> */}
                
                {/* <Route
                  path="/email"
                  element={<ProtectedRoute element={<EmailTemplateManagement />} />}
                /> */}
                {/* <Route
                  path="/catalog"
                  element={<CaseCatalog />}
                /> */}
                
                {/* <Route
                  path="/volunteer-management"
                  element={<ProtectedRoute element={<VolunteerManagement />} />}
                /> */}
                {/* <Route
                  path = "/events"
                  element={
                    <ProtectedRoute
                      element={<EventManagement />}
                      allowedRoles={["admin"]}
                    />
                  }
                /> */}
                {/* <Route
                  path = "/events/:id"
                  element={
                    <ProtectedRoute
                      element={<EventDetail />}
                      allowedRoles={["admin"]}
                    />
                  }
                /> */}
                {/* <Route
                  path="/volunteerLogin"
                  element={<VolunteerLogin />}
                /> */}
                {/* <Route 
                path="/event-catalog"
                element={<EventCatalog />}
                /> */}
                {/* <Route
                  path="/admin-profile"
                  element={<AdminProfile />}
                /> */}
                {/* <Route
                  path="/caseManagement"
                  element={<CaseManagement />}
                /> */}
                
                {/* Playground Routes (Don't Touch!) */}
                <Route
                  path="/playground"
                  element={<Playground />}
                />

                {/* Core Routes (Don't Touch!) */}
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} />}
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
