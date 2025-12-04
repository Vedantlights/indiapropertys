import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Building2, 
  Users, 
  UserCheck
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Properties',
      value: '6',
      change: '+12% vs last month',
      trend: 'up',
      icon: Building2,
      color: '#3b82f6'
    },
    {
      title: 'Total Users',
      value: '8',
      change: '+5% vs last month',
      trend: 'up',
      icon: Users,
      color: '#8b5cf6'
    },
    {
      title: 'Active Agents',
      value: '2',
      change: '+3% vs last month',
      trend: 'up',
      icon: UserCheck,
      color: '#06b6d4'
    }
  ];

  const propertyTypes = [
    { name: 'Apartments', percentage: 35, color: '#3b82f6' },
    { name: 'Houses', percentage: 25, color: '#10b981' },
    { name: 'Commercial', percentage: 15, color: '#f59e0b' },
    { name: 'Villas', percentage: 15, color: '#8b5cf6' },
    { name: 'Land', percentage: 10, color: '#06b6d4' }
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's an overview of your platform.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-content">
                  <div className="stat-header">
                    <span className="stat-title">{stat.title}</span>
                    <div className="stat-icon" style={{ background: `${stat.color}20` }}>
                      <Icon style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="stat-value">{stat.value}</div>

                  {stat.change && (
                    <div className={`stat-change ${stat.trend}`}>
                      <span>{stat.change}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Property Types */}
        <div className="dashboard-card">
          <h2>Property Types Distribution</h2>
          <div className="pie-chart-container">
            <svg viewBox="0 0 200 200" className="pie-chart">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="40" strokeDasharray="175.93 502.65" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="40" strokeDasharray="125.66 502.65" strokeDashoffset="-175.93" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="40" strokeDasharray="75.40 502.65" strokeDashoffset="-301.59" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="#8b5cf6" strokeWidth="40" strokeDasharray="75.40 502.65" strokeDashoffset="-376.99" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="#06b6d4" strokeWidth="40" strokeDasharray="50.27 502.65" strokeDashoffset="-452.39" transform="rotate(-90 100 100)" />
            </svg>

            <div className="pie-labels">
              {propertyTypes.map((type, index) => (
                <div key={index} className="pie-label">
                  <span className="pie-color" style={{ background: type.color }}></span>
                  <span className="pie-text">{type.name} {type.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;