import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
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

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/employee" element={<EmployeePage />} />
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEmployee />} />
        <Route path="/facewebcam" element={<FaceRecognitionWebcamPage />} />
          <Route path="/ppe-detect" element={<PPEDetection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/employee/reward" element={<EmployeeReward />} />
          <Route path="/company/setting" element={<Setting />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/homepage" element={<EmployeeHomepage />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
