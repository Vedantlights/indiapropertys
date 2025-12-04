import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Eye, MessageSquare, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import './AdminSupport.css';

const AdminSupport = () => {
  const tickets = [
    {
      id: 'TCT-001',
      subject: 'Payment Issue',
      user: 'John Doe',
      email: 'john@example.com',
      priority: 'High',
      status: 'Open',
      created: 'Aug 25, 2024'
    },
    {
      id: 'TCT-002',
      subject: 'Suspected Fraudulent Listing',
      user: 'Robert Brown',
      email: 'robert@example.com',
      priority: 'Urgent',
      status: 'In Progress',
      created: 'Aug 26, 2024'
    },
    {
      id: 'TCT-003',
      subject: 'Agent Not Responding',
      user: 'Sarah Williams',
      email: 'sarah@example.com',
      priority: 'Medium',
      status: 'Open',
      created: 'Aug 27, 2024'
    },
    {
      id: 'TCT-004',
      subject: 'Refund Request',
      user: 'John Doe',
      email: 'john@example.com',
      priority: 'Low',
      status: 'Resolved',
      created: 'Aug 20, 2024'
    }
  ];

  const stats = [
    { label: 'Open', value: 2, icon: AlertCircle, color: '#f59e0b' },
    { label: 'In Progress', value: 1, icon: MessageSquare, color: '#3b82f6' },
    { label: 'Resolved', value: 1, icon: CheckCircle, color: '#10b981' },
    { label: 'Closed', value: 0, icon: XCircle, color: '#f6274ff' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#64748b';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#f59e0b';
      case 'In Progress': return '#3b82f6';
      case 'Resolved': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <AdminLayout>
      <div className="admin-support">
        <div className="page-header">
          <div>
            <h1>Support & Complaints</h1>
            <p>4 total tickets</p>
          </div>
        </div>

        <div className="support-stats">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="support-stat-card">
                <div className="stat-icon" style={{ background: `${stat.color}20` }}>
                  <Icon style={{ color: stat.color }} />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <Search />
            <input type="text" placeholder="Search tickets..." />
          </div>
          <button className="filter-btn">
            <Filter />
            All Status
          </button>
          <button className="filter-btn">
            All Priority
          </button>
        </div>

        <div className="tickets-table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>TICKET ID</th>
                <th>SUBJECT</th>
                <th>USER</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>CREATED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="ticket-id">
                    <MessageSquare size={16} />
                    {ticket.id}
                  </td>
                  <td className="subject">{ticket.subject}</td>
                  <td>
                    <div>
                      <div className="user-name">{ticket.user}</div>
                      <div className="user-email">{ticket.email}</div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="priority-badge"
                      style={{ 
                        background: `${getPriorityColor(ticket.priority)}20`,
                        color: getPriorityColor(ticket.priority)
                      }}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        background: `${getStatusColor(ticket.status)}20`,
                        color: getStatusColor(ticket.status)
                      }}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.created}</td>
                  <td>
                    <button className="icon-btn">
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;