import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Global styles
import './App.css';

// =====================
// LANDING PAGE COMPONENTS (Prefixed imports to avoid conflicts)
// =====================
import LandingNavbar from './LandingPage/components/Navbar';
import LandingFooter from './LandingPage/components/Footer';

// Landing Page - Pages
import LandingHome from './LandingPage/pages/LandingHome';
import Login from './LandingPage/pages/Login';
import Register from './LandingPage/pages/Register';
import Search from './LandingPage/pages/Search';
import LandingDashboard from './LandingPage/pages/Dashboard';
import Agents from './LandingPage/pages/Agents';
import LandingContact from './LandingPage/pages/LandingContact';
import PrivacyPolicy from './LandingPage/pages/PrivacyPolicy';
import TermsConditions from './LandingPage/pages/TermCondition';

// =====================
// ADMIN PAGES
// =====================
import AdminLogin from './LandingPage/pages/admin/AdminLogin';
import AdminDashboard from './LandingPage/pages/admin/AdminDashboard';
import AdminProperties from './LandingPage/pages/admin/AdminProperties';
import AdminUsers from './LandingPage/pages/admin/AdminUsers';
import AdminAgents from './LandingPage/pages/admin/AdminAgents';
import AdminSupport from './LandingPage/pages/admin/AdminSupport';
import AdminSettings from './LandingPage/pages/admin/AdminSettings';

// =====================
// USER (BUYER) DASHBOARD (Prefixed imports to avoid conflicts)
// =====================
import BuyerNavbar from './UserDashboard/components/BuyerNavbar';
import BuyerFooter from './UserDashboard/components/Footer';
import BuyerHome from './UserDashboard/pages/BuyerHome';
import BuyerProfile from './UserDashboard/pages/BuyerProfile';
import BuyerContactPage from './UserDashboard/pages/BuyerContactPage';
import ViewDetailsPage from './UserDashboard/pages/ViewDetailsPage';
import SearchResults from './UserDashboard/pages/SearchResults';
import CityFilteredBuy from './UserDashboard/pages/Cityfilteredbuy';
import CityFilteredRent from './UserDashboard/pages/Cityfilteredrent';
import CityProjects from './UserDashboard/pages/Cityprojects';
import ChatUs from './UserDashboard/pages/ChatUs';
import './UserDashboard/styles/global.css';

// =====================
// SELLER DASHBOARD
// =====================
import SellerDashboard from './Seller-Owner/Seller-dashboard';

// =====================
// AGENT DASHBOARD
// =====================
import AgentDashboard from './Agent-dashboard/Agent-dashboard';

// =====================
// LAYOUT COMPONENTS
// =====================

// Layout for Landing Pages WITH Navbar/Footer
const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingNavbar />
      <main>{children}</main>
      <LandingFooter />
    </>
  );
};

// Layout for pages WITHOUT Navbar/Footer (Login, Register, Privacy, Terms)
const NoNavLayout = ({ children }) => {
  return (
    <main>{children}</main>
  );
};

// Layout for Buyer Dashboard
const BuyerDashboardLayout = ({ children }) => {
  return (
    <div className="buyer-dashboard-app">
      <BuyerNavbar />
      <main className="buyer-main-content">{children}</main>
      <BuyerFooter />
    </div>
  );
};

// =====================
// MAIN APP COMPONENT
// =====================
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          {/* ==================== */}
          {/* PUBLIC LANDING PAGES (WITH Navbar/Footer) */}
          {/* ==================== */}
          <Route path="/LandingHome" element={<LandingLayout><LandingHome /></LandingLayout>} />
          <Route path="/search" element={<LandingLayout><Search /></LandingLayout>} />
          <Route path="/Dashboard" element={<LandingLayout><LandingDashboard /></LandingLayout>} />
          <Route path="/agents" element={<LandingLayout><Agents /></LandingLayout>} />
          <Route path="/contact" element={<LandingLayout><LandingContact /></LandingLayout>} />

          {/* ==================== */}
          {/* PAGES WITHOUT Navbar/Footer */}
          {/* ==================== */}
          <Route path="/login" element={<NoNavLayout><Login /></NoNavLayout>} />
          <Route path="/register" element={<NoNavLayout><Register /></NoNavLayout>} />
          <Route path="/privacy-policy" element={<NoNavLayout><PrivacyPolicy /></NoNavLayout>} />
          <Route path="/terms-conditions" element={<NoNavLayout><TermsConditions /></NoNavLayout>} />

          {/* ==================== */}
          {/* ADMIN ROUTES */}
          {/* ==================== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/agents" element={<AdminAgents />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* ==================== */}
          {/* BUYER DASHBOARD ROUTES */}
          {/* These routes match the Navbar links in UserDashboard/components/BuyerNavbar.jsx */}
          {/* ==================== */}
          
          {/* Main buyer dashboard entry point */}
          <Route path="/buyer-dashboard" element={<BuyerDashboardLayout><BuyerHome /></BuyerDashboardLayout>} />
          
          {/* Routes matching Navbar links (without prefix) */}
          <Route path="/buy" element={<BuyerDashboardLayout><CityFilteredBuy /></BuyerDashboardLayout>} />
          <Route path="/rent" element={<BuyerDashboardLayout><CityFilteredRent /></BuyerDashboardLayout>} />
          <Route path="/projects" element={<BuyerDashboardLayout><CityProjects /></BuyerDashboardLayout>} />
          <Route path="/BuyerProfile" element={<BuyerDashboardLayout><BuyerProfile /></BuyerDashboardLayout>} />
          <Route path="/ChatUs" element={<BuyerDashboardLayout><ChatUs /></BuyerDashboardLayout>} />
          <Route path="/chatus" element={<BuyerDashboardLayout><ChatUs /></BuyerDashboardLayout>} />
          <Route path="/BuyerContactPage" element={<BuyerDashboardLayout><BuyerContactPage /></BuyerDashboardLayout>} />
          <Route path="/details/:id" element={<BuyerDashboardLayout><ViewDetailsPage /></BuyerDashboardLayout>} />
          <Route path="/searchresults" element={<BuyerDashboardLayout><SearchResults /></BuyerDashboardLayout>} />
          
          {/* Alternative routes with buyer-dashboard prefix */}
          <Route path="/BuyerHome" element={<BuyerDashboardLayout><BuyerHome /></BuyerDashboardLayout>} />
          <Route path="/buyer-dashboard/buy" element={<BuyerDashboardLayout><CityFilteredBuy /></BuyerDashboardLayout>} />
          <Route path="/buyer-dashboard/rent" element={<BuyerDashboardLayout><CityFilteredRent /></BuyerDashboardLayout>} />
          <Route path="/buyer-dashboard/projects" element={<BuyerDashboardLayout><CityProjects /></BuyerDashboardLayout>} />
          <Route path="/buyer-dashboard/profile" element={<BuyerDashboardLayout><BuyerProfile /></BuyerDashboardLayout>} />
          <Route path="/buyer-dashboard/chat" element={<BuyerDashboardLayout><ChatUs /></BuyerDashboardLayout>} />
          <Route path="/buyer-dashboard/BuyerContactPage" element={<BuyerDashboardLayout><BuyerContactPage /></BuyerDashboardLayout>} />
          <Route path="/buyer-dashboard/search" element={<BuyerDashboardLayout><SearchResults /></BuyerDashboardLayout>} />
          <Route path="/buyer-dashboard/details/:id" element={<BuyerDashboardLayout><ViewDetailsPage /></BuyerDashboardLayout>} />

          {/* ==================== */}
          {/* SELLER DASHBOARD */}
          {/* ==================== */}
          <Route path="/seller-dashboard" element={<SellerDashboard />} />

          {/* ==================== */}
          {/* AGENT DASHBOARD */}
          {/* ==================== */}
          <Route path="/Agent-dashboard" element={<AgentDashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;