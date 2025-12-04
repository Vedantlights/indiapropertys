import React, { useState, useEffect } from 'react';
import PropertyCard, { FavoritesManager} from '../components/PropertyCard';
import '../styles/BuyerProfile.css';


const BuyerProfile = () => {
  const [formData, setFormData] = useState({
    firstName: 'Vikram',
    lastName: 'Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 98765 43210',
    agencyAddress: '402, Business Bay, Corporate Park, Bandra West, Mumbai - 400050'
  });

  // Favorites state
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [activeSection, setActiveSection] = useState('profile'); // 'profile' or 'favorites'

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favorites = FavoritesManager.getFavoriteProperties();
    setFavoriteProperties(favorites);
  };

  const handleFavoriteToggle = () => {
    loadFavorites();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    alert('Profile updated successfully!');
  };

  return (
    <div className="buyer-seller-profile">
      <div className="buyer-profile-header">
        <h1>Profile Settings</h1>
        
        {/* Section Toggle Buttons */}
        <div className="buyer-profile-section-toggle">
          <button 
            className={`buyer-section-btn ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
            Profile Info
          </button>
          <button 
            className={`buyer-section-btn ${activeSection === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveSection('favorites')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            My Favorites ({favoriteProperties.length})
          </button>
        </div>
      </div>

      {activeSection === 'profile' ? (
        <div className="buyer-profile-content">
          {/* Profile Card */}
          <div className="buyer-profile-card">
            <div className="buyer-profile-avatar-section">
              <div className="buyer-avatar-container">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" 
                  alt="Profile" 
                  className="buyer-profile-avatar"
                />
                <button className="buyer-avatar-upload-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              
              <div className="buyer-profile-name-section">
                <h2>Vikram Malhotra</h2>
                <p className="buyer-profile-role">Premium Seller</p>
                <div className="buyer-profile-badges">
                  <span className="buyer-badge buyer-verified">Verified</span>
                  <span className="buyer-badge buyer-pro-agent">Pro Agent</span>
                </div>
              </div>
            </div>

            <div className="buyer-profile-stats">
              <div className="buyer-stat-item">
                <span className="buyer-stat-label">Member since</span>
                <span className="buyer-stat-value">Jan 2023</span>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="buyer-profile-form-card">
            <h3>Personal Information</h3>
            
            <div className="buyer-form-row">
              <div className="buyer-form-group">
                <label>First Name</label>
                <div className="buyer-input-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="buyer-form-group">
                <label>Last Name</label>
                <div className="buyer-input-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="buyer-form-row">
              <div className="buyer-form-group">
                <label>Email Address</label>
                <div className="buyer-input-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="buyer-form-group">
                <label>Phone Number</label>
                <div className="buyer-input-wrapper">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="buyer-form-group buyer-full-width">
              <label>Agency Address</label>
              <div className="buyer-input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input 
                  type="text" 
                  name="agencyAddress"
                  value={formData.agencyAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="buyer-form-actions">
              <button className="buyer-cancel-btn">Cancel</button>
              <button className="buyer-save-btn" onClick={handleSave}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="white" strokeWidth="2"/>
                  <path d="M17 21v-8H7v8M7 3v5h8" stroke="white" strokeWidth="2"/>
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* FAVORITES SECTION */
        <div className="buyer-favorites-section">
          {favoriteProperties.length === 0 ? (
            <div className="buyer-empty-favorites">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#cbd5e0" 
                strokeWidth="1.5"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <h3>No Favorites Yet</h3>
              <p>Start exploring properties and add them to your favorites by clicking the heart icon</p>
            </div>
          ) : (
            <div className="buyer-favorites-grid">
              {favoriteProperties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerProfile;