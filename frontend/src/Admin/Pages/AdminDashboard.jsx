import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  UserCheck,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';
import '../style/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN_DASHBOARD_STATS}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        const statsData = data.data;
        
        // Format stats for display
        const formattedStats = [
          {
            title: 'Total Properties',
            value: statsData.total_properties?.toString() || '0',
            change: `${statsData.pending_properties || 0} pending`,
            trend: 'up',
            icon: Building2,
            color: '#3b82f6'
          },
          {
            title: 'Total Users',
            value: statsData.total_users?.toString() || '0',
            change: `${statsData.users_by_type?.buyer || 0} buyers, ${statsData.users_by_type?.seller || 0} sellers`,
            trend: 'up',
            icon: Users,
            color: '#8b5cf6'
          },
          {
            title: 'Active Agents',
            value: statsData.total_agents?.toString() || '0',
            change: `${statsData.users_by_type?.agent || 0} total agents`,
            trend: 'up',
            icon: UserCheck,
            color: '#06b6d4'
          },
          {
            title: 'Total Inquiries',
            value: statsData.total_inquiries?.toString() || '0',
            change: `${statsData.new_inquiries || 0} new this week`,
            trend: 'up',
            icon: MessageSquare,
            color: '#10b981'
          }
        ];

        setStats(formattedStats);
        setPropertyTypes(statsData.property_types_distribution || []);
        setRecentProperties(statsData.recent_properties || []);
        setRecentInquiries(statsData.recent_inquiries || []);
      } else {
        setError(data.message || 'Failed to load stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Color palette for property types
  const typeColors = {
    'Apartment': '#3b82f6',
    'House': '#10b981',
    'Villa': '#8b5cf6',
    'Commercial': '#f59e0b',
    'Land': '#06b6d4',
    'Plot': '#ef4444',
    'Office': '#6366f1'
  };

  const getColorForType = (typeName) => {
    return typeColors[typeName] || '#64748b';
  };

  // Calculate pie chart segments
  const calculatePieChart = () => {
    if (!propertyTypes || propertyTypes.length === 0) return null;
    
    const total = propertyTypes.reduce((sum, type) => sum + type.count, 0);
    if (total === 0) return null;

    const circumference = 2 * Math.PI * 80; // radius = 80
    let offset = 0;
    
    return propertyTypes.map((type, index) => {
      const percentage = (type.count / total) * 100;
      const dashArray = (percentage / 100) * circumference;
      const dashOffset = -offset;
      offset += dashArray;
      
      return {
        ...type,
        percentage: percentage.toFixed(1),
        dashArray: `${dashArray} ${circumference}`,
        dashOffset: dashOffset,
        color: getColorForType(type.name)
      };
    });
  };

  const pieSegments = calculatePieChart();

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1>Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1>Dashboard</h1>
          <div style={{ color: '#ef4444', marginTop: '20px' }}>
            <AlertCircle size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your platform.</p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="admin-stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="admin-stat-card">
                <div className="admin-stat-content">
                  <div className="admin-stat-header">
                    <span className="admin-stat-title">{stat.title}</span>
                    <div className="admin-stat-icon" style={{ background: `${stat.color}20` }}>
                      <Icon style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="admin-stat-value">{stat.value}</div>

                  {stat.change && (
                    <div className={`admin-stat-change ${stat.trend}`}>
                      <span>{stat.change}</span>
                    </div>
                  )}
                </div>    
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Activity Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Recent Properties */}
        <div className="admin-dashboard-card">
          <h2>Recent Properties</h2>
          {recentProperties.length > 0 ? (
            <div style={{ marginTop: '15px' }}>
              {recentProperties.map((property, index) => (
                <div key={property.id || index} style={{ 
                  padding: '12px', 
                  borderBottom: index < recentProperties.length - 1 ? '1px solid #e2e8f0' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                      {property.title || 'Untitled Property'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {property.seller_name || 'Unknown'} • ₹{property.price?.toLocaleString('en-IN') || '0'}
                    </div>
                  </div>
                  <div style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    background: property.is_active ? '#10b98120' : '#f59e0b20',
                    color: property.is_active ? '#10b981' : '#f59e0b',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {property.is_active ? 'Active' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
              No recent properties
            </p>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="admin-dashboard-card">
          <h2>Recent Inquiries</h2>
          {recentInquiries.length > 0 ? (
            <div style={{ marginTop: '15px' }}>
              {recentInquiries.map((inquiry, index) => (
                <div key={inquiry.id || index} style={{ 
                  padding: '12px', 
                  borderBottom: index < recentInquiries.length - 1 ? '1px solid #e2e8f0' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                      {inquiry.property_title || 'Property Inquiry'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {inquiry.buyer_name || 'Unknown Buyer'}
                    </div>
                  </div>
                  <div style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    background: inquiry.status === 'pending' ? '#f59e0b20' : '#10b98120',
                    color: inquiry.status === 'pending' ? '#f59e0b' : '#10b981',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {inquiry.status || 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
              No recent inquiries
            </p>
          )}
        </div>
      </div>

      {/* Property Types */}
      {pieSegments && pieSegments.length > 0 ? (
        <div className="admin-dashboard-card" style={{ marginTop: '20px' }}>
          <h2>Property Types Distribution</h2>
          <div className="admin-pie-chart-container">
            <svg viewBox="0 0 200 200" className="admin-pie-chart">
              {pieSegments.map((segment, index) => (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="40"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  transform="rotate(-90 100 100)"
                />
              ))}
            </svg>

            <div className="admin-pie-labels">
              {pieSegments.map((type, index) => (
                <div key={index} className="admin-pie-label">
                  <span className="admin-pie-color" style={{ background: type.color }}></span>
                  <span className="admin-pie-text">{type.name} {type.percentage}% ({type.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-dashboard-card" style={{ marginTop: '20px' }}>
          <h2>Property Types Distribution</h2>
          <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
            No property data available
          </p>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
