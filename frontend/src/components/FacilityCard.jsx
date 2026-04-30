import React from 'react';
import { MapPin, Users, Calendar, Edit2, Trash2, Box } from 'lucide-react';

const FacilityCard = ({ facility, onEdit, onDelete }) => {
  const isAvailable = facility.status === 'ACTIVE';

  return (
    <div className="card group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
               <Box size={22} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 {facility.type.replace('_', ' ')}
               </p>
               <h3 className="text-lg font-bold text-slate-900 leading-tight">{facility.name}</h3>
            </div>
        </div>
        <div className={`badge ${isAvailable ? 'badge-active' : 'badge-service'}`}>
          {isAvailable ? 'Active' : 'Maintain'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mb-6">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#003366] opacity-70" />
          <span className="truncate">{facility.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-[#003366] opacity-70" />
          <span>{facility.capacity > 0 ? `${facility.capacity} pax` : 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2 mt-1">
          <Calendar size={16} className="text-[#003366] opacity-70" />
          <span className="text-xs font-medium text-slate-500">{facility.availabilityWindows}</span>
        </div>
      </div>

      <p className="text-slate-500 text-xs mb-6 line-clamp-2 h-8 border-l-2 border-slate-100 pl-3">
        {facility.description}
      </p>

      <div className="flex gap-2 mt-auto">
        <button 
          onClick={() => onEdit(facility)} 
          className="btn btn-primary flex-1 py-2 text-xs gap-2"
        >
          <Edit2 size={14} /> Update Resource
        </button>
        <button 
          onClick={() => onDelete(facility.id)} 
          className="w-10 h-10 bg-red-50 text-red-500 rounded-lg border border-red-100 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center p-0"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;
