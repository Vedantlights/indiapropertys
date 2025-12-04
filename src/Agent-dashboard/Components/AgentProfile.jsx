import React, { useState } from 'react';
import '../styles/AgentProfile.css';

const AgentProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'Vikram',
    lastName: 'Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',   // <-- NEW FIELD ADDED
    alternatePhone: '',
    agencyName: 'Malhotra Properties',
    agencyAddress: '402, Business Bay, Corporate Park, Bandra West, Mumbai - 400050',
    gstNumber: '',
    reraNumber: '',
    bio: 'Experienced real estate professional with 10+ years in Mumbai property market.',
    website: 'www.malhotraproperties.com',
    facebook: '',
    instagram: '',
    linkedin: '',
    profileImage: ""
  });

  const [notifications, setNotifications] = useState({
    emailInquiries: true,
    smsInquiries: true,
    emailUpdates: true,
    smsUpdates: false,
    marketingEmails: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, profileImage: imageUrl });
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'business', label: 'Business Info' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' }
  ];

  return (
    <div className="agent-profile">

      {showSuccess && (
        <div className="success-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" />
          </svg>
          Profile updated successfully!
        </div>
      )}

      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p className="subtitle">Manage your account information and preferences</p>
      </div>

      <div className="profile-layout">

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-cover"></div>

          <div className="profile-avatar-section">

            <div className="avatar-wrapper">
              <img
                src={
                  formData.profileImage ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
                }
                alt="Profile"
                className="profile-avatar"
              />

              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />

              <button
                className="avatar-edit-btn"
                onClick={() => document.getElementById("profileImageInput").click()}
              >
                📸
              </button>
            </div>

            <h2>{formData.firstName} {formData.lastName}</h2>
            <p className="profile-role">{formData.agencyName}</p>

            <div className="profile-badges">
              <span className="badge verified">✔ Verified</span>
              <span className="badge pro">Pro Agent</span>
            </div>
          </div>

          <div className="profile-stats-grid">
            <div className="stat-box"><span className="stat-value">24</span><span className="stat-label">Listed</span></div>
            <div className="stat-box"><span className="stat-value">18</span><span className="stat-label">Sold</span></div>
            <div className="stat-box"><span className="stat-value">4.8</span><span className="stat-label">Rating</span></div>
          </div>

          <div className="member-since">Member since January 2023</div>
        </div>

        {/* Right Section */}
        <div className="settings-content">

          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="tab-content">

            {activeTab === 'personal' && (
              <div className="settings-section">
                <div className="section-header">
                  <h3>Personal Information</h3>
                  {!isEditing && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      Edit
                    </button>
                  )}
                </div>

                <div className="form-grid">

                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* ⭐ NEW LOCATION FIELD ⭐ */}
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="City, State"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

           
            {activeTab === 'business' && (
              <div className="settings-section">
                <div className="section-header">
                  <h3>Business Information</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Agency/Company Name</label>
                    <input
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Website</label>
                    <div className="input-with-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Business Address</label>
                    <div className="input-with-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

                  <div className="form-group">
                    <label>GST Number (Optional)</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="Enter GST number"
                    />
                  </div>

                  <div className="form-group">
                    <label>RERA Number (Optional)</label>
                    <input
                      type="text"
                      name="reraNumber"
                      value={formData.reraNumber}
                      onChange={handleChange}
                      placeholder="Enter RERA number"
                    />
                  </div>
                </div>

                <div className="section-divider"></div>

                <h4 className="subsection-title">Social Links</h4>
                <div className="social-links-grid">
                  <div className="form-group">
                    <label>Facebook</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="facebook.com/username"
                    />
                  </div>
                  <div className="form-group">
                    <label>Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="instagram.com/username"
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button className="save-btn" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <div className="section-header">
                  <h3>Notification Preferences</h3>
                </div>

                <div className="notification-group">
                  <h4>Inquiry Notifications</h4>
                  <p className="group-desc">Get notified when buyers send inquiries for your properties</p>
                  
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Email notifications</span>
                      <span className="toggle-desc">Receive inquiry details via email</span>
                    </div>
                    <button 
                      className={`toggle-switch ${notifications.emailInquiries ? 'active' : ''}`}
                      onClick={() => handleNotificationChange('emailInquiries')}
                    >
                      <span className="toggle-thumb"></span>
                    </button>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">SMS notifications</span>
                      <span className="toggle-desc">Get SMS alerts for new inquiries</span>
                    </div>
                    <button 
                      className={`toggle-switch ${notifications.smsInquiries ? 'active' : ''}`}
                      onClick={() => handleNotificationChange('smsInquiries')}
                    >
                      <span className="toggle-thumb"></span>
                    </button>
                  </div>
                </div>

                <div className="notification-group">
                  <h4>Account Updates</h4>
                  <p className="group-desc">Stay updated with your account activity</p>
                  
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Property updates</span>
                      <span className="toggle-desc">Notifications about your listings</span>
                    </div>
                    <button 
                      className={`toggle-switch ${notifications.emailUpdates ? 'active' : ''}`}
                      onClick={() => handleNotificationChange('emailUpdates')}
                    >
                      <span className="toggle-thumb"></span>
                    </button>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-label">Marketing emails</span>
                      <span className="toggle-desc">Tips and promotional offers</span>
                    </div>
                    <button 
                      className={`toggle-switch ${notifications.marketingEmails ? 'active' : ''}`}
                      onClick={() => handleNotificationChange('marketingEmails')}
                    >
                      <span className="toggle-thumb"></span>
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="save-btn" onClick={handleSave}>
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h3>Security Settings</h3>
                </div>

                <div className="security-card">
                  <div className="security-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="security-info">
                    <h4>Change Password</h4>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button className="security-btn">Change</button>
                </div>

                

                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;