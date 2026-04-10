import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const navigate = useNavigate();
  
  return (
    <aside className="admin-sidebar" style={{ width: '250px', background: '#1e1e2f', color: '#fff', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #333' }}>
        <h2 style={{ margin: 0, color: '#f5a623', fontSize: '1.5rem', fontWeight: 'bold' }}>Paaras Admin</h2>
      </div>
      
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['dashboard', 'categories', 'products'].map((tab) => (
            <li key={tab}>
              <button 
                onClick={() => setActiveTab(tab)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1rem 1.5rem',
                  background: activeTab === tab ? '#2c2c3e' : 'transparent',
                  border: 'none',
                  color: activeTab === tab ? '#f5a623' : '#a0a0b0',
                  borderLeft: activeTab === tab ? '4px solid #f5a623' : '4px solid transparent',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div style={{ padding: '1rem' }}>
        <button 
          onClick={onLogout}
          style={{ width: '100%', padding: '0.8rem', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
