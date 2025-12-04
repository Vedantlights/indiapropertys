import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Component imports
import SellerOverview from './Components/SellerOverview';
import SellerProperties from './Components/SellerProperties';
import SellerInquiries from './Components/SellerInquiries';
import SellerProfile from './Components/SellerProfile';
import Subscription from './Components/PlainTimerPage';

import { PropertyProvider, useProperty } from './Components/PropertyContext';

import './Seller-dashboard.css';

// Inner component that uses the PropertyContext
const SellerDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [daysRemaining] = useState(89);
  const navigate = useNavigate();

  // Get inquiries from PropertyContext
  const { inquiries } = useProperty();

  // Calculate pending (new) inquiries count dynamically
  const pendingInquiriesCount = inquiries.filter(inquiry => inquiry.status === 'new').length;

  // Subscription start date (set this to when user signed up)
  // For demo, setting to today so full 3 months (90 days) are shown
  const subscriptionStartDate = new Date();

  // Calculate subscription end date (3 months from start)
  const subscriptionEndDate = new Date(subscriptionStartDate);
  subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 3);

 
  // Handle scroll for header shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle notification click - navigate to inquiries page
  const handleNotificationClick = () => {
    setActiveTab('inquiries');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SellerOverview onNavigate={handleTabChange} />;
      case 'properties':
        return <SellerProperties />;
      case 'inquiries':
        return <SellerInquiries />;
      case 'profile':
        return <SellerProfile />;
      case 'subscription':
        return <Subscription />;
      default:
        return <SellerOverview onNavigate={handleTabChange} />;
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )},
    { id: 'properties', label: 'My Properties', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'inquiries', label: 'Inquiries', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { id: 'profile', label: 'Profile', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )},
    { id: 'subscription', label: 'Subscription', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
        <path d="M6 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )}
  ];

  return (
    <div className="seller-dashboard">
      
      {/* Header */}
      <header className={`seller-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <button 
            className={`menu-toggle ${isSidebarOpen ? 'active' : ''}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo - Click to go to Overview */}
          <div 
            className="logo" 
            onClick={() => handleTabChange('overview')}
            style={{ cursor: 'pointer' }}
            title="Go to Dashboard"
          >
            <div className="logo-icon-wrapper">
            <img src='/Media/logo.png' alt='logo'/>
            </div>
          </div>
        </div>
        
        <nav className="header-nav">
          {navItems.map((item) => (
            <button 
              key={item.id}
              className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.id === 'inquiries' && pendingInquiriesCount > 0 && (
                <span className="nav-badge">{pendingInquiriesCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="header-right">
          {/* Subscription Timer */}
          <button 
            className={`free-trial-badge ${daysRemaining <= 7 ? 'urgent' : ''}`}
            onClick={() => handleTabChange('subscription')}
          >
            <span className="trial-text">Free Trial</span>
            <br></br>
            <span className="trial-days">{daysRemaining}</span>
            <span className="trial-text">days left</span>
          </button>

          {/* Notification Button - Click navigates to Inquiries page */}
          <button 
            className="notification-btn" 
            aria-label="Notifications"
            onClick={handleNotificationClick}
            title={pendingInquiriesCount > 0 ? `${pendingInquiriesCount} new inquiries` : 'No new inquiries'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" 
                stroke="currentColor" strokeWidth="2" 
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {pendingInquiriesCount > 0 && (
              <span className="notification-badge">{pendingInquiriesCount}</span>
            )}
          </button>
          
          {/* User Profile - Click to go to Profile page */}
          <div 
            className="user-profile"
            onClick={() => handleTabChange('profile')}
            title="Go to Profile"
          >
            <div className="user-avatar">
              <span>V</span>
              <span className="online-dot"></span>
            </div>
            <div className="user-info">
              <span className="user-name">Vikram Malhotra</span>
              <span className="user-role">Pro Seller</span>
            </div>
            <button className="dropdown-btn" aria-label="User menu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <aside className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          {/* Mobile Logo - Click to go to Overview */}
          <div 
            className="logo"
            onClick={() => handleTabChange('overview')}
            style={{ cursor: 'pointer' }}
          >
            <div className="logo-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="white" stroke="white" strokeWidth="2"/>
                <path d="M9 22V12h6v10" stroke="#003B73" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="logo-text">IndiaPropertys</span>
          </div>
          <button 
            className="close-sidebar"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* Mobile User Section - Click to go to Profile */}
        <div 
          className="mobile-user-section"
          onClick={() => handleTabChange('profile')}
          style={{ cursor: 'pointer' }}
        >
          <div className="mobile-user-avatar">V</div>
          <div className="mobile-user-info">
            <span className="mobile-user-name">Vikram Malhotra</span>
            <span className="mobile-user-role">Pro Seller</span>
          </div>
        </div>
        
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <button 
              key={item.id}
              className={`mobile-nav-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
              {item.id === 'inquiries' && pendingInquiriesCount > 0 && (
                <span className="mobile-nav-badge">{pendingInquiriesCount}</span>
              )}
            </button>
          ))}
          
          <div className="mobile-nav-divider"></div>
          
          <button className="mobile-nav-btn logout" onClick={handleLogout}>
            <span className="mobile-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="mobile-nav-label">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="seller-main">
        <div className="main-content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Main component that wraps everything with PropertyProvider
const SellerDashboard = () => {
  return (
    <PropertyProvider>
      <SellerDashboardContent />
    </PropertyProvider>
  );
};

export default SellerDashboard;