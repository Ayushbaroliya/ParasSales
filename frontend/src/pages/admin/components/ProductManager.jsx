import React, { useState } from 'react';

const ProductManager = ({ tiles, categories, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTile, setEditingTile] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '', imageUrl: '', publicId: '', stockStatus: true });
  const [uploading, setUploading] = useState(false);

  const openForm = (tile = null) => {
    setEditingTile(tile);
    if(tile) setFormData(tile);
    else setFormData({ name: '', price: '', category: '', description: '', imageUrl: '', publicId: '', stockStatus: true });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
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
    const method = editingTile ? 'PATCH' : 'POST';
    const url = editingTile ? `/api/tiles?id=${editingTile._id}` : '/api/tiles';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    refresh();
    setShowForm(false);
  };

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Products Catalogue ({tiles.length})</h2>
        <button 
          onClick={() => openForm()}
          style={{ padding: '0.6rem 1.2rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          + Add New Product
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              {editingTile ? 'Edit Product' : 'Create New Product'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
              </div>
              
              <div>
                <label style={labelStyle}>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle} required>
                  <option value="">Select a Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Price (e.g. ₹85/sqft)</label>
                <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} required />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px'}} />
              </div>

              <div>
                <label style={labelStyle}>Product Image</label>
                <div style={{ border: '2px dashed #cbd5e1', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                  <input type="file" onChange={handleFileUpload} accept="image/*" />
                  {uploading && <p style={{ color: '#3b82f6', fontSize: '0.875rem', marginTop: '0.5rem' }}>Uploading to Cloudinary...</p>}
                </div>
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginTop: '1rem' }} />
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" disabled={uploading} style={{ flex: 1, padding: '0.8rem', background: uploading ? '#94a3b8' : '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Product
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.8rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {tiles.map(tile => (
          <div key={tile._id} style={{ display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', background: '#fff' }}>
            <div style={{ position: 'relative', height: '200px' }}>
              <img src={tile.imageUrl} alt={tile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: tile.stockStatus ? '#10b981' : '#ef4444', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {tile.stockStatus ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            
            <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1e293b' }}>{tile.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
                <span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{tile.category}</span>
                <strong style={{ color: '#0f172a' }}>{tile.price}</strong>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button onClick={() => openForm(tile)} style={{ flex: 1, ...actionBtnStyle, background: '#3b82f6', color: '#fff' }}>
                  Edit
                </button>
                <button onClick={() => handleToggleStock(tile)} style={{ flex: 1, ...actionBtnStyle, background: '#f59e0b', color: '#fff' }}>
                  Stock
                </button>
                <button onClick={() => handleDelete(tile._id)} style={{ flex: 1, ...actionBtnStyle, background: '#ef4444', color: '#fff' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', color: '#475569', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' };
const actionBtnStyle = { padding: '0.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'opacity 0.2s' };

export default ProductManager;
