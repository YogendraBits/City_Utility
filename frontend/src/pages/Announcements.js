// src/pages/Announcements.js
import React, { useEffect, useState } from 'react';
import { fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../api';
import { useAuth } from '../context/AuthContext';
import './Announcements.css'; // Ensure you create a CSS file for styles

const Announcements = () => {
  const { user, token } = useAuth(); // Access user role and token for authorization
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'maintenance',
    startDate: '',
    endDate: '',
  });
  const [editingId, setEditingId] = useState(null); // State to track editing
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        setError('Failed to fetch announcements');
      }
    };
    loadAnnouncements();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update announcement if editingId is set
        const updatedAnnouncement = await updateAnnouncement(editingId, formData, token);
        setAnnouncements(announcements.map(ann => (ann._id === editingId ? updatedAnnouncement : ann)));
        setSuccess('Announcement updated successfully');
      } else {
        // Create a new announcement
        const newAnnouncement = await createAnnouncement(formData, token);
        setAnnouncements([...announcements, newAnnouncement]);
        setSuccess('Announcement created successfully');
      }
      resetForm();
    } catch (err) {
      setError(editingId ? 'Failed to update announcement' : 'Failed to create announcement');
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      startDate: announcement.startDate,
      endDate: announcement.endDate,
    });
    setEditingId(announcement._id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id, token);
      setAnnouncements(announcements.filter(ann => ann._id !== id));
      setSuccess('Announcement deleted successfully');
    } catch (err) {
      setError('Failed to delete announcement');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'maintenance', startDate: '', endDate: '' });
    setEditingId(null);
  };

  return (
    <div className="ann-container">
      <h2 className="ann-title">Public Announcements</h2>

      {user?.role === 'admin' && (
        <div className="ann-form-container">
          <h3 className="ann-form-title">{editingId ? 'Edit Announcement' : 'Create New Announcement'}</h3>
          <form className="ann-form" onSubmit={handleSubmit}>
            <div className="ann-form-row">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="ann-input"
              />
              <select name="type" value={formData.type} onChange={handleChange} className="ann-select">
                <option value="maintenance">Maintenance</option>
                <option value="policy">Policy</option>
                <option value="safety">Safety</option>
              </select>
            </div>
            <textarea
              name="content"
              placeholder="Description"
              value={formData.content}
              onChange={handleChange}
              required
              className="ann-textarea"
            />
            <div className="ann-form-row">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="ann-input-date"
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="ann-input-date"
              />
            </div>
            <button type="submit" className="ann-submit-button">{editingId ? 'Update Announcement' : 'Create Announcement'}</button>
            {editingId && <button type="button" className="ann-cancel-button" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      )}

      {error && <p className="ann-error">{error}</p>}
      {success && <p className="ann-success">{success}</p>}

      <ul className="ann-list">
        {announcements.map((announcement) => (
          <li key={announcement._id} className="ann-item">
            <div className="ann-header">
              <h3 className="ann-item-title">{announcement.title}</h3>
              <p className="ann-item-type"><strong>Type:</strong> {announcement.type}</p>
            </div>
            <div className="ann-dates">
              <p className="ann-item-date"><strong>Effective from:</strong> {new Date(announcement.startDate).toLocaleDateString()}</p>
              <p className="ann-item-date"><strong>Until:</strong> {new Date(announcement.endDate).toLocaleDateString()}</p>
            </div>
            <div className="ann-description-container">
              <textarea
                className="ann-description"
                readOnly
                value={announcement.content}
              />
            </div>
            {user?.role === 'admin' && (
              <div className="ann-item-actions">
                <button className="ann-edit-button" onClick={() => handleEdit(announcement)}>Edit</button>
                <button className="ann-delete-button" onClick={() => handleDelete(announcement._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
