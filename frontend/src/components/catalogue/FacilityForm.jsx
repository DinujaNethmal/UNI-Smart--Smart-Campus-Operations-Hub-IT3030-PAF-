import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function FacilityForm({ facility, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    availabilityStart: '08:00',
    availabilityEnd: '18:00',
    ...facility
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'Valid capacity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h2 className="modal-title">{facility ? 'Edit Facility' : 'Add New Facility'}</h2>
          <button className="modal-close" onClick={onCancel}><X size={20} /></button>
        </div>
        
        <form id="fac-form" onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="label">Resource Name</label>
            <input 
              className={`input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Main Auditorium"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="label">Resource Type</label>
            <select 
              className="input"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Laboratory</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Capacity</label>
              <input 
                type="number"
                className={`input ${errors.capacity ? 'error' : ''}`}
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: e.target.value})}
                placeholder="e.g. 50"
              />
            </div>
            <div className="form-group">
              <label className="label">Status</label>
              <select 
                className="input"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Opening Time</label>
              <input 
                type="time"
                className="input"
                value={formData.availabilityStart}
                onChange={e => setFormData({...formData, availabilityStart: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="label">Closing Time</label>
              <input 
                type="time"
                className="input"
                value={formData.availabilityEnd}
                onChange={e => setFormData({...formData, availabilityEnd: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Location</label>
            <input 
              className={`input ${errors.location ? 'error' : ''}`}
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. Building A, Level 2"
            />
          </div>
        </form>

        <div className="modal-footer" style={{ padding: '24px 32px', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" form="fac-form" className="btn btn-primary">
            <Save size={18} /> {facility ? 'Update Facility' : 'Create Facility'}
          </button>
        </div>
      </div>
    </div>
  );
}
