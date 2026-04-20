import { formatDate, formatTime } from '../../utils/dateUtils';

export default function BookingCard({ booking, onCancel, onReview, isAdmin = false }) {
  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';
  const canReview = isAdmin && booking.status === 'PENDING';

  const statusClass =
    booking.status === 'APPROVED'
      ? 'status-badge status-approved'
      : booking.status === 'PENDING'
      ? 'status-badge status-pending'
      : booking.status === 'REJECTED'
      ? 'status-badge status-rejected'
      : 'status-badge status-cancelled';

  return (
    <div className="booking-card">
      <div className="booking-header">
        <div>
          <div className="booking-title">{booking.purpose}</div>
          <div className="booking-meta">Resource ID: {booking.resourceId}</div>
        </div>
        <span className={statusClass}>{booking.status}</span>
      </div>

      <div className="booking-meta">Date: {formatDate(booking.bookingDate)}</div>
      <div className="booking-meta">Time: {formatTime(booking.startTime)} to {formatTime(booking.endTime)}</div>
      <div className="booking-meta">Attendees: {booking.expectedAttendees}</div>

      {booking.rejectionReason && (
        <div className="booking-meta">Rejection reason: {booking.rejectionReason}</div>
      )}

      {(canCancel || canReview) && (
        <div className="button-row">
          {canReview && (
            <>
              <button
                className="btn btn-primary"
                onClick={() => onReview(booking, 'APPROVE')}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onReview(booking, 'REJECT')}
              >
                Reject
              </button>
            </>
          )}

          {canCancel && !isAdmin && (
            <button
              className="btn btn-outline-danger"
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