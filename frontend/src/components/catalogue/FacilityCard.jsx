import { MapPin, Users, Info } from 'lucide-react';

export default function FacilityCard({ facility, onEdit, onDelete, isAdmin = false }) {
  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-body" style={{ padding: 0, flex: 1 }}>
        {facility.imageUrl ? (
          <img 
            src={facility.imageUrl} 
            alt={facility.name} 
            style={{ width: '100%', height: 160, objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '100%', height: 160, background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
            <Info size={40} />
          </div>
        )}
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--slate-900)' }}>{facility.name}</h3>
            <span className="badge badge-approved">{facility.type}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="meta-value" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} color="var(--slate-400)" /> {facility.location}
            </div>
            <div className="meta-value" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} color="var(--slate-400)" /> Capacity: {facility.capacity}
            </div>
          </div>

          <p style={{ marginTop: 14, fontSize: '0.875rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
            {facility.description}
          </p>
        </div>
      </div>
      
      {isAdmin && (
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
          {/* TODO: Implement full edit modal in next phase */}
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => onEdit(facility)}>
            Edit
          </button>
          <button className="btn btn-danger-text" style={{ flex: 1 }} onClick={() => onDelete(facility.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
