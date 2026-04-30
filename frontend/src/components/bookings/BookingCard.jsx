import { CalendarDays, Clock, Users } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';

export default function BookingCard({ booking, onCancel, onReview, isAdmin = false }) {
  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';
  const canReview = isAdmin && booking.status === 'PENDING';

  const badgeClass =
    booking.status === 'APPROVED'
      ? 'badge badge-approved'
      : booking.status === 'PENDING'
      ? 'badge badge-pending'
      : booking.status === 'REJECTED'
      ? 'badge badge-rejected'
      : 'badge badge-cancelled';

  return (
    <div className="booking-item">
      <div className="booking-item-header">
        <div>
          <div className="booking-item-title">{booking.purpose}</div>
          <div className="booking-item-desc">Resource ID: {booking.resourceId}</div>
        </div>

        <span className={badgeClass}>{booking.status}</span>
      </div>

      <div className="booking-item-meta">
        <div className="meta-block">
          <span className="meta-label">Date</span>
          <span className="meta-value">
            <CalendarDays size={15} />
            {formatDate(booking.bookingDate)}
          </span>
        </div>

        <div className="meta-block">
          <span className="meta-label">Time</span>
          <span className="meta-value">
            <Clock size={15} />
            {formatTime(booking.startTime)} to {formatTime(booking.endTime)}
          </span>
        </div>

        <div className="meta-block">
          <span className="meta-label">Attendees</span>
          <span className="meta-value">
            <Users size={15} />
            {booking.expectedAttendees || 0} people
          </span>
        </div>
      </div>

      {booking.rejectionReason && (
        <div className="alert alert-error">
          Rejection reason: {booking.rejectionReason}
        </div>
      )}

      {(canCancel || canReview) && (
        <div className="booking-item-actions">
          {canReview && (
            <>
              <button
                className="btn btn-success"
                onClick={() => onReview(booking, 'APPROVE')}
              >
                Approve
              </button>

              <button
                className="btn btn-danger-text"
                onClick={() => onReview(booking, 'REJECT')}
              >
                Reject
              </button>
            </>
          )}

          {canCancel && !isAdmin && (
            <button
              className="btn btn-danger-text"
              onClick={() => onCancel(booking.id)}
            >
              Cancel Booking
            </button>
          )}
        </div>
      )}
    </div>
  );
}