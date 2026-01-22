import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import AddEmployee from "./components/AddEmployee.jsx";
import FaceRecognitionWebcamPage from "./components/FaceRecognitionWebPage.jsx";
import PPEDetection from "./components/PPEDetection.jsx";
import Dashboard from "./components/Dashboard.jsx";
import About from "./components/About.jsx";
import Homepage from "./components/Homepage.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Feature from "./components/Feature.jsx";
import Subscription from "./components/Subscription.jsx";
import Banner from "./components/Banner.jsx";
import Getintouch from "./components/Getintouch.jsx";
import Footer from "./components/Footer.jsx";
import Summary from "./components/Summary.jsx";
import LandingPage from "./LandingPages/LandingPage.jsx";
import EmployeePage from "./EmployeeComponents/EmployeePage.jsx";
import AdminLogin from "./Auth/AdminLogin.jsx";
import AdminDashboard from "./Auth/AdminDashboard.jsx";
import CompanyLogin from "./Auth/CompanyLogin.jsx";
import CompanyDashboard from "./components/CompanyDashboard.jsx";
import EmployeeReward from "./EmployeeComponents/EmployeeReward.jsx";
import Setting from "./components/Setting.jsx";
import EmployeeDashboard from "./EmployeeComponents/EmployeeDashboard.jsx";
import EmployeeHomepage from "./EmployeeComponents/EmployeeHomepage.jsx";
import EmployeeLogin from "./Auth/EmployeeLogin.jsx";

const Home = () => (
    <>
       <Homepage />
        <About />
        <HowItWorks />
        <Feature />
        <Subscription />
        <Banner />
        <Getintouch />
        <Footer />
    </>
)

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    return null;
  }
};

const getTokenForRole = (role) => {
  if (role === "admin") return localStorage.getItem("admin_token");
  if (role === "employee") return localStorage.getItem("employee_token");
  return localStorage.getItem("company_token") || localStorage.getItem("face_verification_company_token");
};

const getStoredRole = (role) => {
  const key =
    role === "admin"
      ? "admin_user"
      : role === "employee"
      ? "employee_data"
      : "company_user";
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.role || null;
  } catch (err) {
    return null;
  }
};

const loginPathForRole = (role) => {
  if (role === "admin") return "/admin/login";
  if (role === "employee") return "/employee/login";
  return "/company/login";
};

const ProtectedRoute = ({ role, children }) => {
  const token = getTokenForRole(role);
  if (!token) return <Navigate to={loginPathForRole(role)} replace />;
  const tokenRole = decodeToken(token)?.role;
  const storedRole = getStoredRole(role);
  if (tokenRole && tokenRole !== role) return <Navigate to={loginPathForRole(role)} replace />;
  if (!tokenRole && storedRole && storedRole !== role) return <Navigate to={loginPathForRole(role)} replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/employee" element={<EmployeePage />} />
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<ProtectedRoute role="company"><AddEmployee /></ProtectedRoute>} />
        <Route path="/facewebcam" element={<ProtectedRoute role="company"><FaceRecognitionWebcamPage /></ProtectedRoute>} />
          <Route path="/ppe-detect" element={<ProtectedRoute role="company"><PPEDetection /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute role="company"><Dashboard /></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute role="company"><Summary /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/employee/reward" element={<ProtectedRoute role="employee"><EmployeeReward /></ProtectedRoute>} />
          <Route path="/company/setting" element={<ProtectedRoute role="company"><Setting /></ProtectedRoute>} />
          <Route path="/employee/dashboard" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/homepage" element={<ProtectedRoute role="employee"><EmployeeHomepage /></ProtectedRoute>} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
