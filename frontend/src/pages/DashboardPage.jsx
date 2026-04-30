import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  CalendarDays, Clock, CheckCircle2, XCircle,
  PlusSquare, CalendarCheck, Layers
} from 'lucide-react';
import heroImg from '../assets/hero.png';
import { getAllBookings, getMyBookings } from '../api/bookingApi';
import { formatDate, formatTime } from '../utils/dateUtils';
import { useAuth } from '../hooks/useAuth';

const badgeClass = (s) =>
  s === 'APPROVED' ? 'badge badge-approved'
  : s === 'PENDING' ? 'badge badge-pending'
  : s === 'REJECTED' ? 'badge badge-rejected'
  : 'badge badge-cancelled';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadBookings = isAdmin ? getAllBookings : getMyBookings;
    loadBookings().then(setBookings).catch(() => {});
  }, [isAdmin]);

  const pending = bookings.filter(b => b.status === 'PENDING').length;
  const approved = bookings.filter(b => b.status === 'APPROVED').length;
  const rejected = bookings.filter(b => b.status === 'REJECTED').length;
  const recent = bookings.slice(0, 3);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="page-subtitle">Welcome back! Here's your campus operations overview.</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><CalendarDays size={20} /></div>
          <div>
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-label">Active Bookings</div>
            <div className="stat-footer">All time</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><Clock size={20} /></div>
          <div>
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Pending Approvals</div>
            <div className="stat-footer">Requires action</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle2 size={20} /></div>
          <div>
            <div className="stat-value">{approved}</div>
            <div className="stat-label">Approved</div>
            <div className="stat-footer">Confirmed reservations</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><XCircle size={20} /></div>
          <div>
            <div className="stat-value">{rejected}</div>
            <div className="stat-label">Rejected</div>
            <div className="stat-footer">Declined requests</div>
          </div>
        </div>
      </div>

      {/* Two-column panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
        {/* Recent Bookings */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Recent Bookings</div>
            <Link to="/my-bookings" className="panel-link">View All</Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">No bookings yet</div>
          ) : (
            recent.map(b => (
              <div key={b.id} className="booking-item" style={{ padding: '14px 18px' }}>
                <div className="booking-item-header">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--slate-900)' }}>
                      Resource {b.resourceId}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                      {b.purpose}
                    </div>
                  </div>
                  <span className={badgeClass(b.status)}>{b.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: '0.8125rem', color: 'var(--slate-500)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarDays size={13} /> {formatDate(b.bookingDate)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} /> {formatTime(b.startTime)} - {formatTime(b.endTime)}
                  </span>
                </div>
              </div>
            ))
          )}
          <div style={{ padding: '14px 18px' }}>
            <Link to="/new" className="btn btn-primary btn-block btn-lg">
              <PlusSquare size={16} /> Create New Booking
            </Link>
          </div>
        </div>

        {/* Hero / promo card */}
        <div className="hero-banner" style={{ marginBottom: 0 }}>
          <div>
            <h2>Smart Campus Booking</h2>
            <p>Reserve lecture halls, labs, and equipment. Track approvals in real time and avoid scheduling conflicts.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/new" className="btn btn-primary" style={{ background: 'white', color: 'var(--blue-600)' }}>
                Book a Resource
              </Link>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={heroImg} alt="" className="hero-image" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <Link to="/new" className="quick-action-card">
            <CalendarDays size={20} />
            <strong>Book a Resource</strong>
            <span>Reserve rooms or equipment</span>
          </Link>
          <Link to="/my-bookings" className="quick-action-card">
            <CalendarCheck size={20} />
            <strong>My Bookings</strong>
            <span>View your booking history</span>
          </Link>
          <Link to="/admin" className="quick-action-card">
            <Layers size={20} />
            <strong>Manage Requests</strong>
            <span>Review pending approvals</span>
          </Link>
        </div>
      </div>
    </>
  );
}
