import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, Users, AlertCircle, CalendarX, PlusSquare, QrCode } from 'lucide-react';
import { getMyBookings, cancelBooking } from '../api/bookingApi';
import { formatDate, formatTime } from '../utils/dateUtils';
import QRCodeModal from '../components/bookings/QRCodeModal';

const badgeClass = (s) => {
  switch (s) {
    case 'PENDING': return 'badge badge-pending';
    case 'APPROVED': return 'badge badge-approved';
    case 'REJECTED': return 'badge badge-rejected';
    default: return 'badge badge-cancelled';
  }
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [qrBooking, setQrBooking] = useState(null);

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
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filtered = activeTab === 'ALL' ? bookings : bookings.filter(b => b.status === activeTab);
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
        <Link to="/new" className="btn btn-primary">
          <PlusSquare size={16} /> New Booking
        </Link>
      </div>

      {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

      <div className="panel">
        <div className="tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><CalendarX size={28} /></div>
            <div className="empty-state-title">No bookings found</div>
            <div className="empty-state-sub">
              {activeTab === 'ALL' ? 'Create your first booking to get started.' : `No ${activeTab.toLowerCase()} bookings.`}
            </div>
          </div>
        ) : (
          filtered.map(b => (
            <div className="booking-entry" key={b.id}>
              <div className="booking-entry-top">
                <div>
                  <span className="booking-entry-name">Resource {b.resourceId}</span>
                  <span style={{ marginLeft: 8 }} className={badgeClass(b.status)}>{b.status}</span>
                </div>
              </div>
              <div className="booking-entry-desc">{b.purpose}</div>
              <div className="booking-entry-meta">
                <div className="booking-meta-item">
                  <span className="booking-meta-label">Date</span>
                  <span className="booking-meta-value"><CalendarDays size={13} /> {formatDate(b.bookingDate)}</span>
                </div>
                <div className="booking-meta-item">
                  <span className="booking-meta-label">Time</span>
                  <span className="booking-meta-value"><Clock size={13} /> {formatTime(b.startTime)} - {formatTime(b.endTime)}</span>
                </div>
                {b.expectedAttendees && (
                  <div className="booking-meta-item">
                    <span className="booking-meta-label">Attendees</span>
                    <span className="booking-meta-value"><Users size={13} /> {b.expectedAttendees} people</span>
                  </div>
                )}
              </div>

              {b.rejectionReason && (
                <div className="alert alert-error" style={{ marginBottom: 0 }}>
                  <AlertCircle size={14} /> Rejection reason: {b.rejectionReason}
                </div>
              )}

              <div className="booking-entry-actions" style={{ marginTop: 10 }}>
                {b.status === 'APPROVED' && (
                  <button className="btn btn-outline btn-sm" onClick={() => setQrBooking(b)}>
                    <QrCode size={14} /> View QR Code
                  </button>
                )}
                {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(b.id)}>
                    {b.status === 'PENDING' ? 'Withdraw Request' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {qrBooking && <QRCodeModal booking={qrBooking} onClose={() => setQrBooking(null)} />}
    </>
  );
}
