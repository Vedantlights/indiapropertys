import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Shield, Save } from 'lucide-react';
import './AdminSettings.css';

const AdminSettings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = () => {
    // Add password change logic here
    console.log('Changing password...');
  };

  const handleSaveChanges = () => {
    // Add save logic here
    console.log('Saving changes...');
  };

  return (
    <AdminLayout>
      <div className="admin-settings">
        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your privacy and security settings</p>
          </div>
        </div>

        <div className="settings-grid">
          {/* Privacy & Security */}
          <div className="settings-card">
            <div className="settings-header">
              <Shield />
              <h2>Privacy & Security</h2>
            </div>
            <p className="settings-description">Manage your account password</p>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="password-row">
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <button className="change-password-btn" onClick={handleChangePassword}>
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="save-settings-btn" onClick={handleSaveChanges}>
            <Save />
            Save All Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;