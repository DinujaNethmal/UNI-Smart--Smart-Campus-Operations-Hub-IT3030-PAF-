import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, MapPin, Users, CalendarX, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { getMyBookings, cancelBooking } from '../api/bookingApi';
import { formatDate, formatTime } from '../utils/dateUtils';

const badgeClass = (s) =>
  s === 'APPROVED' ? 'badge badge-approved'
  : s === 'PENDING' ? 'badge badge-pending'
  : s === 'REJECTED' ? 'badge badge-rejected'
  : 'badge badge-cancelled';

const badgeIcon = (s) =>
  s === 'APPROVED' ? <CheckCircle2 size={11} />
  : s === 'PENDING' ? <Clock size={11} />
  : s === 'REJECTED' ? <XCircle size={11} />
  : <CalendarX size={11} />;

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data);
      setError(null);
    } catch {
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const filtered = activeTab === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const counts = {
    ALL: bookings.length,
    PENDING: bookings.filter(b => b.status === 'PENDING').length,
    APPROVED: bookings.filter(b => b.status === 'APPROVED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  const tabs = [
    { key: 'ALL', label: 'All Bookings' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <div className="page-subtitle">View and manage your facility bookings</div>
        </div>
        <Link to="/new" className="btn btn-primary">New Booking</Link>
      </div>

      {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

      <div className="panel">
        {/* Tabs */}
        <div className="tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label} ({counts[t.key] || 0})
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><CalendarX size={28} /></div>
            <div className="empty-state-title">No bookings found</div>
            <div className="empty-state-sub">
              {activeTab === 'ALL'
                ? 'Your booking requests will appear here.'
                : `No ${activeTab.toLowerCase()} bookings.`}
            </div>
          </div>
        ) : (
          filtered.map(b => (
            <div key={b.id} className="booking-item">
              <div className="booking-item-header">
                <div className="booking-item-title">
                  Resource {b.resourceId}
                  <span className={badgeClass(b.status)}>
                    {badgeIcon(b.status)} {b.status}
                  </span>
                </div>
              </div>
              <div className="booking-item-desc">{b.purpose}</div>

              <div className="booking-item-meta">
                <div className="meta-block">
                  <div className="meta-label">Date</div>
                  <div className="meta-value"><CalendarDays size={14} /> {formatDate(b.bookingDate)}</div>
                </div>
                <div className="meta-block">
                  <div className="meta-label">Time</div>
                  <div className="meta-value"><Clock size={14} /> {formatTime(b.startTime)} - {formatTime(b.endTime)}</div>
                </div>
                {b.expectedAttendees && (
                  <div className="meta-block">
                    <div className="meta-label">Attendees</div>
                    <div className="meta-value"><Users size={14} /> {b.expectedAttendees} people</div>
                  </div>
                )}
              </div>

              {b.status === 'APPROVED' && (
                <div className="booking-item-reviewer">Approved by Admin</div>
              )}
              {b.rejectionReason && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--red-700)', marginBottom: 10 }}>
                  Rejection reason: {b.rejectionReason}
                </div>
              )}

              <div className="booking-item-actions">
                {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                  <button className="btn btn-danger-text" onClick={() => handleCancel(b.id)}>
                    {b.status === 'PENDING' ? 'Withdraw Request' : 'Cancel Booking'}
                  </button>
                )}
                <button className="btn btn-ghost">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
