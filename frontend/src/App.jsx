import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Landing & Form Pages
import Home from "./pages/landing";
import Form from "./pages/form";

// Login Pages
import InternLogin from "./pages/InternPages/internLogin";
import SupervisorLogin from "./pages/SupervisorPages/supervisorLogin";
import AdminLogin from "./pages/AdminPages/adminLogin";

// Intern Dashboard
import InternDashboard from "./pages/InternPages/internDashboard";
import SupervisorDashboard from "./pages/SupervisorPages/SupervisorDashboard";
import CompanyChats from "./pages/InternPages/companyChat";

// Admin Pages
import Cohorts from "./pages/AdminPages/cohorts";
import CohortDetailsPage from "./pages/AdminPages/cohortDetail";
import AcceptedInternsPage from "./pages/AdminPages/AcceptedInternsPage";
import Registration from "./components/adminComponents/Registration";
import Settings from "./components/adminComponents/Settings";
import SupervisorsList from "./components/adminComponents/SupervisorsList";
import AdministratorsList from "./components/adminComponents/AdministratorsList";

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#D1FAE5",
            color: "#065F46",
            border: "1px solid #34D399",
            fontWeight: "bold",
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<Home />} />
        <Route path="/apply" element={<Form />} />
        <Route path="/intern-login" element={<InternLogin />} />
        <Route path="/supervisor-login" element={<SupervisorLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/supervisors" element={<SupervisorsList />} />
        <Route path="/admin/administrators" element={<AdministratorsList />} />

        <Route path="/supervisorDashboard/:supervisorId/:cohortId" element={<SupervisorDashboard />} />

        {/* Intern Dashboard */}
        <Route path="/internDashboard/:id" element={<InternDashboard />} />
         <Route path="/company-chats" element={<CompanyChats/>} />

        {/* Admin Dashboard */}
        <Route path="/admin/cohorts" element={<Cohorts />} />
        <Route path="/admin/cohorts/:cohortId" element={<CohortDetailsPage />} />
        <Route
          path="/admin/cohort/:cohortId/accepted"
          element={<AcceptedInternsPage />}
        />
        <Route
          path="/admin/register-supervisor"
          element={<Registration view="register-supervisor" />}
        />
        <Route
          path="/admin/register-admin"
          element={<Registration view="register-admin" />}
        />
        <Route path="/admin/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
