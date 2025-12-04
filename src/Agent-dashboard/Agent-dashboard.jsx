import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Component imports
import AgentOverview from './Components/AgentOverview';
import AgentProperties from './Components/AgentProperties';
import AgentInquiries from './Components/AgentInquiries';
import AgentProfile from './Components/AgentProfile';
import Subscription from './Components/PlainTimerPage';

import { PropertyProvider } from './Components/PropertyContext';

import './Agent-dashboard.css';

const AgentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [daysRemaining] = useState(89);
  const navigate = useNavigate();

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
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const openProfileFromHeader = () => {
    handleTabChange('profile');
  };

  const openInquiriesFromBell = () => {
    handleTabChange('inquiries');
  };

  const renderContent = () => {
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
    <PropertyProvider>
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
            {navItems.map((item) => (
              <button 
                key={item.id}
                className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleTabChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.id === 'inquiries' && notifications > 0 && (
                  <span className="nav-badge">{notifications}</span>
                )}
              </button>
            ))}
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
                <span>V</span>
                <span className="online-dot"></span>
              </div>
              <div className="user-info">
                <span className="user-name">Vikram Malhotra</span>
                <span className="user-role">Pro Agent</span>
              </div>
              <button className="dropdown-btn">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="agent-main">
          <div className="main-content-wrapper">
            {renderContent()}
          </div>
        </main>

      </div>
    </PropertyProvider>
  );
};

export default AgentDashboard;
