import { MapPin, Users, Edit, Trash2, Clock } from 'lucide-react';

export default function FacilityCard({ facility, isAdmin, onEdit, onDelete }) {
  const statusClass = facility.status === 'ACTIVE' ? 'badge-approved' : 'badge-rejected';
  
  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-body" style={{ flex: 1, padding: 20 }}>
        <div className="booking-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, color: 'var(--slate-900)', fontSize: '1.1rem' }}>{facility.name}</div>
          <span className={`badge ${statusClass}`}>{facility.status}</span>
        </div>
        
        <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          {facility.type.replace('_', ' ')}
          <span style={{ color: 'var(--slate-300)' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={14} /> {facility.availabilityStart?.slice(0,5)} - {facility.availabilityEnd?.slice(0,5)}
          </span>
        </div>

        <div className="booking-item-meta" style={{ display: 'flex', gap: 24 }}>
          <div className="meta-block">
            <div className="meta-label" style={{ fontSize: '0.65rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</div>
            <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--slate-700)' }}>
              <MapPin size={14} /> {facility.location}
            </div>
          </div>
          <div className="meta-block">
            <div className="meta-label" style={{ fontSize: '0.65rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Capacity</div>
            <div className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--slate-700)' }}>
              <Users size={14} /> {facility.capacity} pax
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--slate-100)', display: 'flex', gap: 10, background: 'var(--slate-50)' }}>
          <button className="btn btn-ghost" style={{ flex: 1, padding: '8px' }} onClick={() => onEdit(facility)}>
            <Edit size={16} /> Edit
          </button>
          <button className="btn btn-danger-text" style={{ flex: 1, padding: '8px' }} onClick={() => onDelete(facility.id)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
