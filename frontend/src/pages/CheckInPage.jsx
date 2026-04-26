import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, CalendarDays, Clock, Users, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { getBookingById } from '../api/bookingApi';
import { formatDate, formatTime } from '../utils/dateUtils';

export default function CheckInPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    getBookingById(id)
      .then(data => {
        setBooking(data);
        setError(null);
      })
      .catch(() => {
        setError('Booking not found or invalid QR code');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} color="var(--blue-600)" className="spin" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to Dashboard</Link>
        <div className="panel" style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }}>
          <div style={{ padding: 40 }}>
            <div style={{
              display: 'inline-flex', padding: 16, borderRadius: '50%',
              background: 'var(--red-100)', color: 'var(--red-600)', marginBottom: 16,
            }}>
              <XCircle size={32} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>
              Invalid Check-in
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{error}</p>
          </div>
        </div>
      </>
    );
  }

  const isValid = booking.status === 'APPROVED';

  return (
    <>
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to Dashboard</Link>

      <div className="panel" style={{ maxWidth: 500, margin: '20px auto' }}>
        <div style={{ padding: 32, textAlign: 'center' }}>
          {isValid ? (
            <>
              <div style={{
                display: 'inline-flex', padding: 16, borderRadius: '50%',
                background: checkedIn ? 'var(--green-100)' : 'var(--blue-50)',
                color: checkedIn ? 'var(--green-600)' : 'var(--blue-600)',
                marginBottom: 16,
                transition: 'all 0.3s',
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                {checkedIn ? 'Checked In Successfully' : 'Booking Verified'}
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: 24 }}>
                {checkedIn ? 'Enjoy your session!' : 'This booking is valid and approved.'}
              </p>

              <span className="badge badge-approved" style={{ fontSize: '0.75rem', padding: '4px 12px', marginBottom: 24, display: 'inline-block' }}>
                APPROVED
              </span>
            </>
          ) : (
            <>
              <div style={{
                display: 'inline-flex', padding: 16, borderRadius: '50%',
                background: 'var(--red-100)', color: 'var(--red-600)', marginBottom: 16,
              }}>
                <XCircle size={36} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                Booking Not Valid
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: 12 }}>
                Status: <span className={`badge badge-${booking.status.toLowerCase()}`}>{booking.status}</span>
              </p>
            </>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--gray-100)', padding: 24 }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gray-900)', marginBottom: 16 }}>
            Booking Details
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarDays size={14} /> Date
              </span>
              <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{formatDate(booking.bookingDate)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} /> Time
              </span>
              <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} /> Resource
              </span>
              <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>Resource {booking.resourceId}</span>
            </div>

            {booking.expectedAttendees && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={14} /> Attendees
                </span>
                <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{booking.expectedAttendees}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--gray-500)' }}>Purpose</span>
              <span style={{ fontWeight: 600, color: 'var(--gray-800)', textAlign: 'right', maxWidth: 220 }}>
                {booking.purpose}
              </span>
            </div>
          </div>
        </div>

        {isValid && !checkedIn && (
          <div style={{ padding: '0 24px 24px' }}>
            <button
              className="btn btn-success btn-lg btn-full"
              onClick={() => setCheckedIn(true)}
            >
              <CheckCircle2 size={18} /> Confirm Check-in
            </button>
          </div>
        )}

        <div style={{
          borderTop: '1px solid var(--gray-100)',
          padding: '12px 24px',
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--gray-400)',
        }}>
          Booking #{booking.id} &middot; Smart Campus Operations Hub
        </div>
      </div>
    </>
  );
}
