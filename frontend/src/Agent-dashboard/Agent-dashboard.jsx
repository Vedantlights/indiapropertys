import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Component imports
import AgentOverview from './Components/AgentOverview';
import AgentProperties from './Components/AgentProperties';
import AgentInquiries from './Components/AgentInquiries';
import AgentProfile from './Components/AgentProfile';
import Subscription from './Components/PlainTimerPage';
// Use buyer's ViewDetailsPage for all property details (same layout for buyers, sellers, and agents)
import ViewDetailsPage from '../UserDashboard/pages/ViewDetailsPage';

import { PropertyProvider, useProperty } from './Components/PropertyContext';
import { authAPI } from '../services/api.service';

import './Agent-dashboard.css';

// Inner component that uses PropertyContext
const AgentDashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { getStats } = useProperty();
  
  // Function to refresh user data
  const refreshUserData = async () => {
    let currentUser = authAPI.getUser();
    
    // If no user data in localStorage, try to verify token and get fresh data
    if (!currentUser && authAPI.isAuthenticated()) {
      try {
        const response = await authAPI.verifyToken();
        if (response.success && response.data) {
          currentUser = response.data.user;
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }
    
    setUser(currentUser);
    setImageError(false); // Reset image error when user changes
  };

  // Get user data on mount
  useEffect(() => {
    refreshUserData();
  }, []);

  // Refresh user data when navigating to profile (in case profile was updated)
  useEffect(() => {
    if (activeTab === 'profile') {
      refreshUserData();
    }
  }, [activeTab]);

  // Listen for user data updates from profile component
  useEffect(() => {
    const handleUserDataUpdate = () => {
      refreshUserData();
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  // Get notification count from inquiries
  const stats = getStats();
  const notifications = stats.newInquiries || 0;
  const daysRemaining = 89; // This can be fetched from subscription API later

  // Update active tab based on route
  useEffect(() => {
    // Check for both agent-pro-details (old route) and /details/ (buyer's route)
    const isDetailsPage = location.pathname.includes('/agent-pro-details/') || location.pathname.includes('/details/');
    
    // If we're on details page, don't change activeTab
    if (isDetailsPage) {
      return;
    }
    
    // Otherwise, update activeTab based on pathname
    if (location.pathname.includes('/properties') || location.pathname === '/agent-dashboard/properties') {
      setActiveTab('properties');
    } else if (location.pathname.includes('/inquiries') || location.pathname === '/agent-dashboard/inquiries') {
      setActiveTab('inquiries');
    } else if (location.pathname.includes('/profile') || location.pathname === '/agent-dashboard/profile') {
      setActiveTab('profile');
    } else if (location.pathname.includes('/subscription') || location.pathname === '/agent-dashboard/subscription') {
      setActiveTab('subscription');
    } else if (location.pathname === '/agent-dashboard' || location.pathname === '/agent-dashboard/') {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const subscriptionStartDate = new Date();
  const subscriptionEndDate = new Date(subscriptionStartDate);
  subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 3);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Navigate to the appropriate route
    if (tab === 'overview') {
      navigate('/agent-dashboard');
    } else if (tab === 'properties') {
      navigate('/agent-dashboard/properties');
    } else if (tab === 'inquiries') {
      navigate('/agent-dashboard/inquiries');
    } else if (tab === 'profile') {
      navigate('/agent-dashboard/profile');
    } else if (tab === 'subscription') {
      navigate('/agent-dashboard/subscription');
    }
  };

  const openProfileFromHeader = () => {
    handleTabChange('profile');
  };

  const openInquiriesFromBell = () => {
    handleTabChange('inquiries');
  };

  const renderContent = () => {
    // Check if we're on property details page (use buyer's ViewDetailsPage for all)
    const isDetailsPage = location.pathname.includes('/agent-pro-details/') || location.pathname.includes('/details/');
    
    if (isDetailsPage) {
      // Use buyer's ViewDetailsPage component (same layout for all users)
      return <ViewDetailsPage />;
    }
    
    switch (activeTab) {
      case 'overview':
        return <AgentOverview onNavigate={handleTabChange} />;
      case 'properties':
        return <AgentProperties />;
      case 'inquiries':
        return <AgentInquiries />;
      case 'profile':
        return <AgentProfile />;
      case 'subscription':
        return <Subscription />;
      default:
        return <AgentOverview onNavigate={handleTabChange} />;
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
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/>
        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )},
    { id: 'inquiries', label: 'Inquiries', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )},
    { id: 'profile', label: 'Profile', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )},
    { id: 'subscription', label: 'Subscription', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
        <path d="M6 15h4" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 15h4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )}
  ];

  return (
    <div className="agent-dashboard">

      {/* HEADER */}
      <header className={`agent-header ${scrolled ? 'scrolled' : ''}`}>
          <div className="header-left">
            <button 
              className={`menu-toggle ${isSidebarOpen ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <span></span><span></span><span></span>
            </button>

            <div className="logo">
              <div className="logo-icon-wrapper">
                <img src="/Media/logo.png" alt="logo" />
              </div>
            </div>
          </div>

          <nav className="header-nav">
            {navItems.map((item) => {
              // Don't highlight tab when on details page
              const isDetailsPage = location.pathname.includes('/agent-pro-details/') || location.pathname.includes('/details/');
              const isActive = !isDetailsPage && activeTab === item.id;
              
              return (
                <button 
                  key={item.id}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTabChange(item.id);
                  }}
                  type="button"
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.id === 'inquiries' && notifications > 0 && (
                    <span className="nav-badge">{notifications}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="header-right">

            {/* Free Trial */}
            <button 
              className={`free-trial-badge ${daysRemaining <= 7 ? 'urgent' : ''}`}
              onClick={() => handleTabChange('subscription')}
            >
              <span className="trial-text">Free Trial</span>
              <br />
              <span className="trial-days">{daysRemaining}</span>
              <span className="trial-text">days left</span>
            </button>

            {/* BELL ICON → OPEN INQUIRIES */}
            <button 
              className="notification-btn"
              onClick={openInquiriesFromBell}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9" 
                  stroke="currentColor" strokeWidth="2"/>
              </svg>
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </button>

            {/* USER PROFILE → OPEN PROFILE */}
            <div className="user-profile" onClick={openProfileFromHeader}>
              <div className="user-avatar">
                {user?.profile_image && !imageError ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.full_name || 'User'} 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
                <span className="online-dot"></span>
              </div>
              <div className="user-info">
                <span className="user-name">{user?.full_name || 'Loading...'}</span>
                <span className="user-role">Pro Agent</span>
              </div>
              <button className="dropdown-btn">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor"/>
                </svg>
              </button>
            </div>

            {/* Logout Button */}
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="agent-main">
          <div className="main-content-wrapper">
            {renderContent()}
          </div>
        </main>

      </div>
    );
};

// Outer component that provides PropertyContext
const AgentDashboard = () => {
  return (
    <PropertyProvider>
      <AgentDashboardContent />
    </PropertyProvider>
  );
};

export default AgentDashboard;
