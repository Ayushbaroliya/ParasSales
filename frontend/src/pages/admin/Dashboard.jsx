import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('tiles');
  const [tiles, setTiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tilesRes, catRes] = await Promise.all([
        fetch('/api/tiles'),
        fetch('/api/categories')
      ]);
      setTiles(await tilesRes.json());
      setCategories(await catRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    navigate('/admin/login');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd' }}>
        <button 
          onClick={() => setActiveTab('tiles')}
          style={{ padding: '1rem', background: 'none', border: 'none', borderBottom: activeTab === 'tiles' ? '2px solid #ff6b6b' : 'none', cursor: 'pointer', fontWeight: activeTab === 'tiles' ? 'bold' : 'normal' }}
        >
          Manage Tiles
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{ padding: '1rem', background: 'none', border: 'none', borderBottom: activeTab === 'categories' ? '2px solid #ff6b6b' : 'none', cursor: 'pointer', fontWeight: activeTab === 'categories' ? 'bold' : 'normal' }}
        >
          Manage Categories
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === 'tiles' ? (
        <TileManagement tiles={tiles} categories={categories} refresh={fetchData} />
      ) : (
        <CategoryManagement categories={categories} refresh={fetchData} />
      )}
    </div>
  );
};

const TileManagement = ({ tiles, categories, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTile, setEditingTile] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tile?')) return;
    await fetch(`/api/tiles?id=${id}`, { method: 'DELETE' });
    refresh();
  };

  const handleToggleStock = async (tile) => {
    await fetch(`/api/tiles?id=${tile._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockStatus: !tile.stockStatus }),
    });
    refresh();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Tiles ({tiles.length})</h2>
        <button 
          onClick={() => { setEditingTile(null); setShowForm(true); }}
          style={{ padding: '0.5rem 1rem', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add New Tile
        </button>
      </div>

      {showForm && (
        <TileForm 
          tile={editingTile} 
          categories={categories} 
          onClose={() => setShowForm(false)} 
          refresh={refresh} 
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {tiles.map(tile => (
          <div key={tile._id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', padding: '1rem' }}>
            <img src={tile.imageUrl} alt={tile.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
            <h3 style={{ margin: '0.5rem 0' }}>{tile.name}</h3>
            <p><strong>Price:</strong> {tile.price}</p>
            <p><strong>Category:</strong> {tile.category}</p>
            <p><strong>Stock:</strong> {tile.stockStatus ? 'In Stock' : 'Out of Stock'}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button 
                onClick={() => { setEditingTile(tile); setShowForm(true); }}
                style={{ flex: 1, padding: '0.4rem', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleToggleStock(tile)}
                style={{ flex: 1, padding: '0.4rem', background: '#FF9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Stock
              </button>
              <button 
                onClick={() => handleDelete(tile._id)}
                style={{ flex: 1, padding: '0.4rem', background: '#F44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TileForm = ({ tile, categories, onClose, refresh }) => {
  const [formData, setFormData] = useState(tile || { name: '', price: '', category: '', description: '', imageUrl: '', publicId: '', stockStatus: true });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      setFormData({ ...formData, imageUrl: result.url, publicId: result.public_id });
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = tile ? 'PATCH' : 'POST';
    const url = tile ? `/api/tiles?id=${tile._id}` : '/api/tiles';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    refresh();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
       <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
          <h2>{tile ? 'Edit Tile' : 'Add Tile'}</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label>Name</label>
            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} required />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Price (e.g. ₹85/sqft)</label>
            <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Image</label>
            <input type="file" onChange={handleFileUpload} />
            {uploading && <p>Uploading...</p>}
            {formData.imageUrl && <img src={formData.imageUrl} style={{ width: '100px', marginTop: '0.5rem' }} />}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '4px' }}>Save</button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '0.75rem', background: '#ccc', border: 'none', borderRadius: '4px' }}>Cancel</button>
          </div>
       </form>
    </div>
  );
};

const CategoryManagement = ({ categories, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', nameHi: '', icon: '', cover: '', description: '' });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    refresh();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ id: '', name: '', nameHi: '', icon: '', cover: '', description: '' });
    setShowForm(false);
    refresh();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Categories ({categories.length})</h2>
        <button onClick={() => setShowForm(true)} style={{ padding: '0.5rem 1rem', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px' }}>Add Category</button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>New Category</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input placeholder="ID (e.g. wall-tiles)" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required />
            <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input placeholder="Name (Hindi)" value={formData.nameHi} onChange={e => setFormData({...formData, nameHi: e.target.value})} />
            <input placeholder="Icon (emoji)" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
            <input placeholder="Cover Image URL" value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ gridColumn: 'span 2' }} />
            <button type="submit" style={{ gridColumn: 'span 2', padding: '0.5rem', background: '#ff6b6b', color: '#fff', border: 'none' }}>Save Category</button>
          </form>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Icon</th>
            <th>Name</th>
            <th>ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>{c.icon}</td>
              <td>{c.name}</td>
              <td>{c.id}</td>
              <td>
                <button onClick={() => handleDelete(c._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
