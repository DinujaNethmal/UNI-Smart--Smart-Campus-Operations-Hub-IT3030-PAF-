import { X, CheckCircle2, CalendarDays, Clock, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate, formatTime } from '../../utils/dateUtils';

export default function QRCodeModal({ booking, onClose }) {
  if (!booking) return null;

  const checkInUrl = `${window.location.origin}/check-in/${booking.id}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 32,
        maxWidth: 400,
        width: '90%',
        position: 'relative',
        textAlign: 'center',
      }} onClick={e => e.stopPropagation()}>

        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12,
          border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--gray-400)',
        }}>
          <X size={20} />
        </button>

        <div style={{
          display: 'inline-flex', padding: 12, borderRadius: '50%',
          background: 'var(--green-100)', color: 'var(--green-600)', marginBottom: 16,
        }}>
          <CheckCircle2 size={28} />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
          Booking QR Code
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginBottom: 20 }}>
          Present this code at the venue for check-in
        </p>

        <div style={{
          background: 'white',
          border: '2px solid var(--gray-200)',
          borderRadius: 12,
          padding: 20,
          display: 'inline-block',
          marginBottom: 20,
        }}>
          <QRCodeSVG
            value={checkInUrl}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#1E3A5F"
            level="M"
            includeMargin={false}
          />
        </div>

        <div style={{
          background: 'var(--gray-50)',
          borderRadius: 10,
          padding: 14,
          textAlign: 'left',
          fontSize: '0.8125rem',
          color: 'var(--gray-700)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.875rem' }}>
            {booking.purpose}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarDays size={14} color="var(--gray-400)" />
            {formatDate(booking.bookingDate)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} color="var(--gray-400)" />
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </div>
          {booking.expectedAttendees && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} color="var(--gray-400)" />
              {booking.expectedAttendees} attendees
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, fontSize: '0.7rem', color: 'var(--gray-400)' }}>
          Booking #{booking.id} &middot; Resource {booking.resourceId}
        </div>
      </div>
    </div>
  );
}
