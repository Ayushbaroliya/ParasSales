import React, { useState } from 'react';

const CategoryManager = ({ categories, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', nameHi: '', icon: '', cover: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? This might break products linked to it!')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    refresh();
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      id: category.id,
      name: category.name,
      nameHi: category.nameHi || '',
      icon: category.icon || '',
      cover: category.cover || '',
      description: category.description || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `/api/categories?id=${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      setFormData({ id: '', name: '', nameHi: '', icon: '', cover: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      refresh();
    } catch (error) {
      console.error(error);
      alert('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingId(null);
      setFormData({ id: '', name: '', nameHi: '', icon: '', cover: '', description: '' });
    } else {
      setShowForm(true);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: '#333' }}>Category Management ({categories.length})</h2>
        <button 
          onClick={toggleForm} 
          style={{ padding: '0.6rem 1.2rem', background: showForm ? '#64748b' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          {showForm ? 'Cancel' : '+ Add New Category'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>{editingId ? 'Edit Category' : 'Create Category'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Slug ID (e.g. wall-tiles)</label>
              <input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})} style={inputStyle} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
              <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name (Hindi) Optional</label>
              <input value={formData.nameHi} onChange={e => setFormData({...formData, nameHi: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Icon (Emoji)</label>
              <input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Cover Image URL (Optional)</label>
              <input value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{...inputStyle, height: '80px', resize: 'vertical'}} />
            </div>
            <button disabled={loading} type="submit" style={{ gridColumn: 'span 2', padding: '0.8rem', background: loading ? '#94a3b8' : '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Saving...' : editingId ? 'Update Category' : 'Save Category'}
            </button>
          </form>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem', borderRadius: '8px 0 0 8px' }}>Icon</th>
              <th style={{ padding: '1rem' }}>ID Slug</th>
              <th style={{ padding: '1rem' }}>Display Name</th>
              <th style={{ padding: '1rem', borderRadius: '0 8px 8px 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem', fontSize: '1.5rem' }}>{c.icon || '📁'}</td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#64748b' }}>{c.id}</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{c.name}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleEdit(c)} 
                      style={{ color: '#3b82f6', backgroundColor: '#dbeafe', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(c._id)} 
                      style={{ color: '#ef4444', backgroundColor: '#fee2e2', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No categories found. Add some!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  outline: 'none',
  fontSize: '0.95rem'
};

export default CategoryManager;
