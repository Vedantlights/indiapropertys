import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  UserCheck, 
  Headphones, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/properties', icon: Building2, label: 'Properties' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/agents', icon: UserCheck, label: 'Agents' },
    { path: '/admin/support', icon: Headphones, label: 'Support' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-container">

          {/* Logo */}
          <div className="navbar-logo" onClick={() => navigate('/admin/dashboard')}>
            <Home className="logo-icon" />
            <span className="logo-text">Admin Panel</span>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Navigation Menu */}
          <div className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Logout */}
            <button className="logout-btn mobile-logout" onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </button>
          </div>

          {/* Right Side (Only Logout Now) */}
          <button className="logout-btn desktop-logout" onClick={handleLogout}>
            <LogOut />
            <span>Logout</span>
          </button>

        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
