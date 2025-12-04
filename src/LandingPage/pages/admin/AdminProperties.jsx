import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Eye, Edit, Trash2, X, Check } from 'lucide-react';
import './AdminProperties.css';

const AdminProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const allProperties = [
    {
      id: 1,
      name: 'Luxury Villa in Beverly Hills',
      location: 'Beverly Hills, CA',
      type: 'Villa',
      listing: 'Sale',
      price: '$4,500,000',
      status: 'Approved',
      featured: true
    },
    {
      id: 2,
      name: 'Modern Downtown Apartment',
      location: 'Downtown, NY',
      type: 'Apartment',
      listing: 'Rent',
      price: '$3,500',
      status: 'Approved',
      featured: false
    },
    {
      id: 3,
      name: 'Cozy Family Home',
      location: 'Chicago, IL',
      type: 'House',
      listing: 'Sale',
      price: '$650,000',
      status: 'Pending',
      featured: false
    },
    {
      id: 4,
      name: 'Commercial Office Space',
      location: 'San Francisco, CA',
      type: 'Commercial',
      listing: 'Rent',
      price: '$8,000',
      status: 'Approved',
      featured: true
    },
    {
      id: 5,
      name: 'Beachfront Condo',
      location: 'Miami, FL',
      type: 'Apartment',
      listing: 'Sale',
      price: '$890,000',
      status: 'Pending',
      featured: false
    },
    {
      id: 6,
      name: 'Mountain Retreat Cabin',
      location: 'Denver, CO',
      type: 'House',
      listing: 'Sale',
      price: '$425,000',
      status: 'Rejected',
      featured: false
    }
  ];

  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || property.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AdminLayout>
      <div className="admin-properties">
        <div className="page-header">
          <div>
            <h1>Manage Properties</h1>
            <p>{filteredProperties.length} of {allProperties.length} properties</p>
          </div>
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <div className="search-input-wrapper">
              <Search />
              <input
                type="text"
                placeholder="Search by name, location, or type..."
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
              {statusFilter}
            </button>
            
            {showFilterDropdown && (
              <div className="filter-dropdown">
                {['All Status', 'Approved', 'Pending', 'Rejected'].map(status => (
                  <div
                    key={status}
                    className={`filter-option ${statusFilter === status ? 'active' : ''}`}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="properties-table-container">
          {filteredProperties.length > 0 ? (
            <table className="properties-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>PROPERTY</th>
                  <th>TYPE</th>
                  <th>LISTING</th>
                  <th>PRICE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td>#{property.id}</td>
                    <td>
                      <div className="property-cell">
                        <div className="property-icon">
                          <img src="/api/placeholder/40/40" alt="" />
                        </div>
                        <div>
                          <div className="property-name">{property.name}</div>
                          <div className="property-location">{property.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>{property.type}</td>
                    <td>
                      <span className={`listing-badge ${property.listing.toLowerCase()}`}>
                        {property.listing}
                      </span>
                    </td>
                    <td className="price-cell">{property.price}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          background: `${getStatusColor(property.status)}20`,
                          color: getStatusColor(property.status)
                        }}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="actions-column">
                      <div className="action-buttons">
                        <button className="icon-btn" title="View">
                          <Eye />
                        </button>
                        {property.status === 'Pending' && (
                          <>
                            <button className="icon-btn success" title="Approve">
                              <Check />
                            </button>
                            <button className="icon-btn danger" title="Reject">
                              <X />
                            </button>
                          </>
                        )}
                        <button className="icon-btn" title="Edit">
                          <Edit />
                        </button>
                        <button className="icon-btn danger" title="Delete">
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
              <h3>No properties found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;