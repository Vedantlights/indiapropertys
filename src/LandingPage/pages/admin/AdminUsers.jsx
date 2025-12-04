import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Trash2 } from 'lucide-react';
import './AdminUsers.css';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const allUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      role: 'Buyer',
      kycStatus: 'Verified',
      status: 'Active',
      joined: 'Jan 15, 2024'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      role: 'Seller',
      kycStatus: 'Pending',
      status: 'Active',
      joined: 'Feb 20, 2024'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892',
      role: 'Agent',
      kycStatus: 'Verified',
      status: 'Active',
      joined: 'Mar 10, 2024'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+1234567893',
      role: 'Buyer',
      kycStatus: 'Rejected',
      status: 'Banned',
      joined: 'Apr 5, 2024'
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert@example.com',
      phone: '+1234567895',
      role: 'Buyer',
      kycStatus: 'Pending',
      status: 'Active',
      joined: 'May 12, 2024'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1234567896',
      role: 'Seller',
      kycStatus: 'Verified',
      status: 'Active',
      joined: 'Jun 18, 2024'
    },
    {
      id: 7,
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1234567897',
      role: 'Agent',
      kycStatus: 'Verified',
      status: 'Active',
      joined: 'Jul 22, 2024'
    }
  ];

  // Filter users based on search and role
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getKYCColor = (status) => {
    switch (status) {
      case 'Verified': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? '#10b981' : '#ef4444';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = (userId) => {
    console.log('Deleting user:', userId);
    // Add your delete logic here
  };

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="page-header">
          <div>
            <h1>Manage Users</h1>
            <p>{filteredUsers.length} of {allUsers.length} users</p>
          </div>
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <div className="search-input-wrapper">
              <Search />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              className="filter-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter />
              {roleFilter}
            </button>
            
            {showFilterDropdown && (
              <div className="filter-dropdown">
                {['All Roles', 'Buyer', 'Seller', 'Agent'].map(role => (
                  <div
                    key={role}
                    className={`filter-option ${roleFilter === role ? 'active' : ''}`}
                    onClick={() => {
                      setRoleFilter(role);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="users-table-container">
          {filteredUsers.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>PHONE</th>
                  <th>ROLE</th>
                  <th>KYC STATUS</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {getInitials(user.name)}
                        </div>
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="phone-cell">{user.phone}</td>
                    <td className="role-cell">{user.role}</td>

                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: `${getKYCColor(user.kycStatus)}20`,
                          color: getKYCColor(user.kycStatus)
                        }}
                      >
                        {user.kycStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className="status-badge"
                        style={{
                          background: `${getStatusColor(user.status)}20`,
                          color: getStatusColor(user.status)
                        }}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="joined-cell">{user.joined}</td>

                    <td className="actions-column">
                      <div className="action-buttons">
                        <button 
                          className="icon-btn danger" 
                          title="Delete User"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <h3>No users found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;