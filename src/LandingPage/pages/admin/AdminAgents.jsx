import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Eye, Star } from 'lucide-react';
import './AdminAgents.css';

const AdminAgents = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const agents = [
    {
      id: 1,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'Verified',
      leads: 28,
      rating: 4.80
    },
    {
      id: 2,
      name: 'David Wilson',
      email: 'david@example.com',
      status: 'Verified',
      leads: 19,
      rating: 4.60
    }
  ];

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-agents">
        <div className="page-header">
          <div>
            <h1>Manage Agents</h1>
            <p>{agents.length} registered agents</p>
          </div>
        </div>

        <div className="filters-bar">
          <div className="search-box">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">
              Search
            </button>
          </div>
          <button className="filter-btn">
            <Filter />
            <span>All Status</span>
          </button>
        </div>

        <div className="agents-table-container">
          <table className="agents-table">
            <thead>
              <tr>
                <th>AGENT</th>
                <th>STATUS</th>
                <th>LEADS</th>
                <th>RATING</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr key={agent.id}>
                  <td data-label="Agent">
                    <div className="agent-cell">
                      <div className="agent-avatar">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="agent-name">{agent.name}</div>
                        <div className="agent-email">{agent.email}</div>
                      </div>
                    </div>
                  </td>

                  <td data-label="Status">
                    <span className="status-badge verified">
                      {agent.status}
                    </span>
                  </td>

                  <td data-label="Leads">
                    <div className="leads-badge">{agent.leads}</div>
                  </td>

                  <td data-label="Rating">
                    <div className="rating">
                      <Star size={16} fill="#eab308" stroke="#eab308" />
                      <span>{agent.rating}</span>
                    </div>
                  </td>

                  <td data-label="Actions" className="actions-cell">
                    <div className="actions-wrapper">
                       <button className="icon-btn" title="View Details">
                        <Eye size={18} />
                      </button>
                    </div>
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

export default AdminAgents;
