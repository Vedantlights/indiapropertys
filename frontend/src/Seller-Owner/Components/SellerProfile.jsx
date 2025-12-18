import React, { useState, useEffect, useRef } from 'react';
import {
  validateIndianPhone,
  validateEmail,
  validateGST,
  validateURL,
  validateTextLength,
  sanitizeInput,
  validateImageFile,
  validateImageDimensions
} from '../../utils/validation';
import { sellerProfileAPI } from '../../services/api.service';
import '../styles/SellerProfile.css';

const SellerProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    agencyName: '',
    agencyAddress: '',
    gstNumber: '',
    reraNumber: '',
    bio: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  });

  const [notifications, setNotifications] = useState({
    emailInquiries: true,
    smsInquiries: true,
    emailUpdates: true,
    smsUpdates: false,
    marketingEmails: false
  });

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await sellerProfileAPI.get();
        
        if (response.success && response.data && response.data.profile) {
          const profile = response.data.profile;
          
          // Split full_name into firstName and lastName
          const nameParts = (profile.full_name || '').split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          // Parse social_links
          let socialLinks = profile.social_links || {};
          if (typeof socialLinks === 'string') {
            try {
              socialLinks = JSON.parse(socialLinks);
            } catch (e) {
              socialLinks = {};
            }
          }
          
          // Set profile image (from users table)
          setProfileImage(profile.profile_image || '');
          
          setFormData({
            firstName: firstName,
            lastName: lastName,
            email: profile.email || '',
            phone: profile.phone || '',
            alternatePhone: '', // Not in backend yet
            agencyName: profile.company_name || '',
            agencyAddress: profile.address || '',
            gstNumber: '', // Not in backend yet
            reraNumber: profile.license_number || '',
            bio: profile.bio || '',
            website: profile.website || '',
            facebook: socialLinks.facebook || '',
            instagram: socialLinks.instagram || '',
            linkedin: socialLinks.linkedin || ''
          });
        } else {
          // If no profile, set empty values
          setProfileImage('');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Keep default empty values on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Sanitize text inputs
    if (['firstName', 'lastName', 'bio', 'agencyName', 'agencyAddress'].includes(name)) {
      sanitizedValue = sanitizeInput(value);
    }
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
    
    // Clear error when user makes changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateProfile = () => {
    const newErrors = {};
    
    // First Name validation
    const firstNameValidation = validateTextLength(formData.firstName, 2, 50, 'First name');
    if (!firstNameValidation.valid) {
      newErrors.firstName = firstNameValidation.message;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name should contain only letters';
    }
    
    // Last Name validation
    const lastNameValidation = validateTextLength(formData.lastName, 2, 50, 'Last name');
    if (!lastNameValidation.valid) {
      newErrors.lastName = lastNameValidation.message;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name should contain only letters';
    }
    
    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message;
    }
    
    // Phone validation
    const phoneValidation = validateIndianPhone(formData.phone);
    if (!phoneValidation.valid) {
      newErrors.phone = phoneValidation.message;
    }
    
    // Alternate Phone validation (optional)
    if (formData.alternatePhone) {
      const altPhoneValidation = validateIndianPhone(formData.alternatePhone);
      if (!altPhoneValidation.valid) {
        newErrors.alternatePhone = altPhoneValidation.message;
      }
    }
    
    // Agency Name validation
    if (formData.agencyName) {
      const agencyValidation = validateTextLength(formData.agencyName, 2, 100, 'Agency name');
      if (!agencyValidation.valid) {
        newErrors.agencyName = agencyValidation.message;
      }
    }
    
    // GST validation
    if (formData.gstNumber) {
      const gstValidation = validateGST(formData.gstNumber);
      if (!gstValidation.valid) {
        newErrors.gstNumber = gstValidation.message;
      }
    }
    
    // Website validation
    if (formData.website) {
      const urlValidation = validateURL(formData.website);
      if (!urlValidation.valid) {
        newErrors.website = urlValidation.message;
      }
    }
    
    // Social media URL validations
    if (formData.facebook) {
      const fbValidation = validateURL(formData.facebook);
      if (!fbValidation.valid) {
        newErrors.facebook = 'Invalid Facebook URL';
      }
    }
    
    if (formData.instagram) {
      const igValidation = validateURL(formData.instagram);
      if (!igValidation.valid) {
        newErrors.instagram = 'Invalid Instagram URL';
      }
    }
    
    if (formData.linkedin) {
      const liValidation = validateURL(formData.linkedin);
      if (!liValidation.valid) {
        newErrors.linkedin = 'Invalid LinkedIn URL';
      }
    }
    
    // Bio validation
    if (formData.bio) {
      const bioValidation = validateTextLength(formData.bio, 0, 500, 'Bio');
      if (!bioValidation.valid) {
        newErrors.bio = bioValidation.message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    // Validate dimensions
    try {
      const dimensionValidation = await validateImageDimensions(file, 200, 200);
      if (!dimensionValidation.valid) {
        alert(dimensionValidation.message);
        return;
      }
    } catch (error) {
      alert('Error validating image dimensions');
      return;
    }

    setUploadingImage(true);

    try {
      // Upload image to backend
      const response = await sellerProfileAPI.uploadProfileImage(file);
      
      if (response.success && response.data && response.data.url) {
        setProfileImage(response.data.url);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!validateProfile()) {
      return; // Don't save if validation fails
    }
    
    try {
      setIsEditing(false);
      
      // Prepare data for backend
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const socialLinks = {
        facebook: formData.facebook || '',
        instagram: formData.instagram || '',
        linkedin: formData.linkedin || ''
      };
      
      const updateData = {
        full_name: fullName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio || null,
        address: formData.agencyAddress || null,
        company_name: formData.agencyName || null,
        license_number: formData.reraNumber || null,
        website: formData.website || null,
        social_links: socialLinks
      };
      
      const response = await sellerProfileAPI.update(updateData);
      
      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Update formData with response if needed
        if (response.data && response.data.profile) {
          const profile = response.data.profile;
          const nameParts = (profile.full_name || '').split(' ');
          setFormData(prev => ({
            ...prev,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: profile.email || prev.email,
            phone: profile.phone || prev.phone
          }));
        }
      } else {
        alert(response.message || 'Failed to update profile');
        setIsEditing(true); // Re-enable editing on error
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
      setIsEditing(true); // Re-enable editing on error
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )},
    { id: 'notifications', label: 'Notifications', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )},
    { id: 'security', label: 'Security', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )}
  ];

  if (loading) {
    return (
      <div className="seller-profile" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #003B73',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading profile...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-profile">
      {/* Success Toast */}
      {showSuccess && (
        <div className="seller-profile-success-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Profile updated successfully!
        </div>
      )}

      {/* Header */}
      <div className="seller-profile-header">
        <h1>Profile Settings</h1>
        <p className="seller-profile-subtitle">Manage your account information and preferences</p>
      </div>

      <div className="seller-profile-layout">
        {/* Profile Card */}
        <div className="seller-profile-card">
          <div className="seller-profile-cover"></div>
          <div className="seller-seller-profile-avatar-img-section">
            <div className="seller-seller-profile-avatar-img-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <img 
                src={profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"} 
                alt="Profile" 
                className="seller-profile-avatar-img"
              />
              <button 
                className="seller-profile-avatar-seller-profile-edit-btn"
                onClick={handleImageSelect}
                disabled={uploadingImage}
                title="Change profile photo"
              >
                {uploadingImage ? (
                  <div className="spinner-small"></div>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
            
            <h2>
              {formData.firstName || formData.lastName 
                ? `${formData.firstName} ${formData.lastName}`.trim() 
                : 'Your Name'}
            </h2>
            <p className="seller-profile-role">
              {formData.agencyName || 'Your Agency'}
            </p>
            
            <div className="seller-profile-badges">
              <span className="seller-profile-badge verified">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Verified
              </span>
              <span className="seller-profile-badge pro">Pro Seller</span>
            </div>
          </div>

          <div className="seller-profile-stats-grid">
            <div className="seller-profile-stat-box">
              <span className="seller-profile-stat-value">24</span>
              <span className="seller-profile-stat-label">Listed</span>
            </div>
            <div className="seller-profile-stat-box">
              <span className="seller-profile-stat-value">18</span>
              <span className="seller-profile-stat-label">Sold</span>
            </div>
          </div>

          <div className="seller-profile-member-since">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Member since January 2023
          </div>
        </div>

        {/* Settings Content */}
        <div className="seller-profile-settings-content">
          {/* Tabs */}
          <div className="seller-profile-settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`seller-profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="seller-profile-tab-content">
            {activeTab === 'personal' && (
              <div className="seller-profile-settings-section">
                <div className="seller-profile-section-header">
                  <h3>Personal Information</h3>
                  {!isEditing && (
                    <button className="seller-profile-edit-btn" onClick={() => setIsEditing(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Edit
                    </button>
                  )}
                </div>

                <div className="seller-profile-form-grid">
                  <div className="seller-profile-form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="seller-profile-form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="seller-profile-error-text">{errors.lastName}</span>}
                  </div>

                  <div className="seller-profile-form-group">
                    <label>Email Address</label>
                    <div className="seller-profile-input-with-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="seller-profile-error-text">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="seller-profile-form-group">
                    <label>Phone Number</label>
                    <div className="seller-profile-input-with-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={errors.phone ? 'error' : ''}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && <span className="seller-profile-error-text">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="seller-profile-form-group seller-profile-full-width">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className={errors.bio ? 'error' : ''}
                    />
                    {errors.bio && <span className="seller-profile-error-text">{errors.bio}</span>}
                  </div>
                </div>

                {isEditing && (
                  <div className="seller-profile-form-actions">
                    <button className="seller-profile-cancel-btn" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button className="seller-profile-save-btn" onClick={handleSave}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}


            {activeTab === 'notifications' && (
              <div className="seller-profile-settings-section">
                <div className="seller-profile-section-header">
                  <h3>Notification Preferences</h3>
                </div>

                <div className="seller-profile-notification-group">
                  <h4>Inquiry Notifications</h4>
                  <p className="seller-profile-group-desc">Get notified when buyers send inquiries for your properties</p>
                  
                  <div className="seller-profile-toggle-item">
                    <div className="seller-profile-toggle-info">
                      <span className="seller-profile-toggle-label">Email notifications</span>
                      <span className="seller-profile-toggle-desc">Receive inquiry details via email</span>
                    </div>
                    <button 
                      className={`seller-profile-toggle-switch ${notifications.emailInquiries ? 'active' : ''}`}
                      onClick={() => handleNotificationChange('emailInquiries')}
                    >
                      <span className="seller-profile-toggle-thumb"></span>
                    </button>
                  </div>

                  <div className="seller-profile-toggle-item">
                    <div className="seller-profile-toggle-info">
                      <span className="seller-profile-toggle-label">SMS notifications</span>
                      <span className="seller-profile-toggle-desc">Get SMS alerts for new inquiries</span>
                    </div>
                    <button 
                      className={`seller-profile-toggle-switch ${notifications.smsInquiries ? 'active' : ''}`}
                      onClick={() => handleNotificationChange('smsInquiries')}
                    >
                      <span className="seller-profile-toggle-thumb"></span>
                    </button>
                  </div>
                </div>

                <div className="seller-profile-notification-group">
                  <h4>Account Updates</h4>
                  <p className="seller-profile-group-desc">Stay updated with your account activity</p>
                  
                  <div className="seller-profile-toggle-item">
                    <div className="seller-profile-toggle-info">
                      <span className="seller-profile-toggle-label">Property updates</span>
                      <span className="seller-profile-toggle-desc">Notifications about your listings</span>
                    </div>
                    <button 
                      className={`seller-profile-toggle-switch ${notifications.emailUpdates ? 'active' : ''}`}
                      onClick={() => handleNotificationChange('emailUpdates')}
                    >
                      <span className="seller-profile-toggle-thumb"></span>
                    </button>
                  </div>

                </div>

                <div className="seller-profile-form-actions">
                  <button className="seller-profile-save-btn" onClick={handleSave}>
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="seller-profile-settings-section">
                <div className="seller-profile-section-header">
                  <h3>Security Settings</h3>
                </div>

                <div className="seller-profile-security-card">
                  <div className="seller-profile-security-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="seller-profile-security-info">
                    <h4>Change Password</h4>
                    <p>Update your password to keep your account secure</p>
                  </div>
                  <button className="seller-profile-security-btn">Change</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;