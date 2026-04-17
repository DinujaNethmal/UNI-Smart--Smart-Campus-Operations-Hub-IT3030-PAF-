import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { createBooking } from '../../api/bookingApi';

export default function BookingForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    resourceId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        resourceId: parseInt(formData.resourceId),
        bookingDate: formData.bookingDate,
        startTime: formData.startTime + ':00',
        endTime: formData.endTime + ':00',
        purpose: formData.purpose,
        expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees) : null,
      };
      const result = await createBooking(payload);
      onSuccess?.(result);
      setFormData({ resourceId: '', bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Resource ID</label>
          <input className="form-input" type="number" name="resourceId" value={formData.resourceId} onChange={handleChange} required />
          <span className="form-hint">Pick from the facilities catalogue</span>
        </div>

        <div className="form-group">
          <label className="form-label">Booking Date</label>
          <input className="form-input" type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input className="form-input" type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">End Time</label>
          <input className="form-input" type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Purpose</label>
          <textarea className="form-textarea" name="purpose" value={formData.purpose} onChange={handleChange} rows={3} required maxLength={500} />
          <span className="form-hint">Max 500 characters</span>
        </div>

        <div className="form-group">
          <label className="form-label">Expected Attendees</label>
          <input className="form-input" type="number" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} min={1} />
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </div>
    </form>
  );
}