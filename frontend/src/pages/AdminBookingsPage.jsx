import { useEffect, useState } from 'react';
import {
  Search, CalendarDays, Clock, MapPin, Users,
  Check, X, AlertCircle, Clock3
} from 'lucide-react';
import { getAllBookings, reviewBooking } from '../api/bookingApi';
import { formatDate, formatTime } from '../utils/dateUtils';

const badgeClass = (s) =>
  s === 'APPROVED' ? 'badge badge-approved'
  : s === 'PENDING' ? 'badge badge-review'
  : s === 'REJECTED' ? 'badge badge-rejected'
  : 'badge badge-cancelled';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
      setError(null);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleReview = async (id, decision) => {
    const reason = decision === 'REJECT' ? prompt('Please enter a rejection reason:') : null;
    if (decision === 'REJECT' && !reason) return;
    try {
      await reviewBooking(id, decision, reason);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to review booking');
    }
  };

  const filtered = bookings
    .filter(b => activeTab === 'ALL' ? true : b.status === activeTab)
    .filter(b =>
      searchTerm === '' ||
      b.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(b.resourceId).includes(searchTerm)
    );

  const counts = {
    PENDING: bookings.filter(b => b.status === 'PENDING').length,
    APPROVED: bookings.filter(b => b.status === 'APPROVED').length,
    ALL: bookings.length,
  };

  const tabs = [
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'ALL', label: 'All Bookings' },
  ];

  const formatCreatedAt = (dt) => {
    if (!dt) return '';
    try {
      const d = new Date(dt);
      return d.toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Bookings</h1>
          <div className="page-subtitle">Review and approve facility booking requests</div>
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Stats Cards - Restoring Tarini's expected overview */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon blue"><CalendarDays size={20} /></div>
          <div>
            <div className="stat-value">{counts.ALL}</div>
            <div className="stat-label">Total Requests</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><Clock3 size={20} /></div>
          <div>
            <div className="stat-value">{counts.PENDING}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Check size={20} /></div>
          <div>
            <div className="stat-value">{counts.APPROVED}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
      </div>

>>>>>>> Feature/Dinuja
      {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}

      <div className="panel">
        {/* Search */}
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by facility, requester, or purpose..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

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
            <div className="empty-state-title">No bookings match this filter</div>
          </div>
        ) : (
          filtered.map(b => (
            <div key={b.id} className="booking-item">
              <div className="booking-item-header">
                <div className="booking-item-title">
                  Resource {b.resourceId}
                  <span className={badgeClass(b.status)}>
                    {b.status === 'PENDING' ? 'PENDING REVIEW' : b.status}
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                  Requested by User {b.userId}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                  {formatCreatedAt(b.createdAt)}
                </div>
              </div>

              {b.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-approve" onClick={() => handleReview(b.id, 'APPROVE')}>
                    <Check size={16} /> Approve
                  </button>
                  <button className="btn btn-reject" onClick={() => handleReview(b.id, 'REJECT')}>
                    <X size={16} /> Reject
                  </button>
                </div>
              )}

              {b.rejectionReason && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--red-700)', marginTop: 8 }}>
                  Rejection reason: {b.rejectionReason}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
