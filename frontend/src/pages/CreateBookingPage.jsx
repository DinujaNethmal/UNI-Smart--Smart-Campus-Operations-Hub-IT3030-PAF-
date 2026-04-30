import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, CalendarDays, Clock, FileText,
  Users, AlertCircle, StickyNote
} from 'lucide-react';
import { createBooking } from '../api/bookingApi';

export default function CreateBookingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resourceId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createBooking({
        resourceId: parseInt(formData.resourceId),
        bookingDate: formData.bookingDate,
        startTime: formData.startTime + ':00',
        endTime: formData.endTime + ':00',
        purpose: formData.purpose,
        expectedAttendees: formData.expectedAttendees ? parseInt(formData.expectedAttendees) : null,
      });
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link to="/" className="page-back"><ArrowLeft size={16} /> Back</Link>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Booking</h1>
          <div className="page-subtitle">Request a booking for facilities or equipment</div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-card">
        {/* Resource */}
        <div className="form-group">
          <label className="form-label">Select Facility / Equipment <span className="required">*</span></label>
          <div className="form-input-wrap">
            <Building2 size={16} className="input-icon" />
            <input
              className="form-input"
              type="number"
              name="resourceId"
              placeholder="Enter resource ID (e.g. 1)"
              value={formData.resourceId}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Date + Times */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date <span className="required">*</span></label>
            <div className="form-input-wrap">
              <CalendarDays size={16} className="input-icon" />
              <input
                className="form-input"
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Start Time <span className="required">*</span></label>
            <div className="form-input-wrap">
              <Clock size={16} className="input-icon" />
              <input
                className="form-input"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">End Time <span className="required">*</span></label>
            <div className="form-input-wrap">
              <Clock size={16} className="input-icon" />
              <input
                className="form-input"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div className="form-group">
          <label className="form-label">Purpose of Booking <span className="required">*</span></label>
          <div className="form-input-wrap">
            <FileText size={16} className="input-icon" style={{ top: '18px', transform: 'none' }} />
            <input
              className="form-input"
              type="text"
              name="purpose"
              placeholder="e.g., Computer Science Lecture - IT3030"
              value={formData.purpose}
              onChange={handleChange}
              required
              maxLength={500}
            />
          </div>
        </div>

        {/* Attendees */}
        <div className="form-group">
          <label className="form-label">Expected Attendees</label>
          <div className="form-input-wrap">
            <Users size={16} className="input-icon" />
            <input
              className="form-input"
              type="number"
              name="expectedAttendees"
              placeholder="Number of expected attendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
              min={1}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Additional Notes (Optional)</label>
          <textarea
            className="form-textarea"
            name="notes"
            placeholder="Any special requirements or additional information..."
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Info note */}
        <div className="form-note">
          <strong>Note:</strong> Your booking request will be reviewed by an administrator.
          You will receive a notification once it's approved or rejected.
          The system will automatically check for scheduling conflicts.
        </div>

        {/* Actions */}
        <div className="form-actions">
          <Link to="/" className="btn btn-ghost btn-lg" style={{ flex: 1, justifyContent: 'center' }}>Cancel</Link>
          <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </div>
      </form>
    </>
  );
}
