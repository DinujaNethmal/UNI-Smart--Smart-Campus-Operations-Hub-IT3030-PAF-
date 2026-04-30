import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Building2 } from 'lucide-react';

const FacilityForm = ({ facility, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: 0,
    location: '',
    availabilityWindows: '08:00 - 18:00',
    status: 'ACTIVE',
    description: ''
  });

  useEffect(() => {
    if (facility) {
      setFormData(facility);
    }
  }, [facility]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003366] text-white flex items-center justify-center">
               <Building2 size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-900">
                {facility ? 'Modify Resource' : 'Register New Resource'}
              </h2>
              <p className="text-xs text-slate-500">Resource information management</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Facility Title</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Malabe Campus Hall 1" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="LAB">Lab</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="EQUIPMENT">Equipment Unit</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="0" required />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Room/Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="Building B, Floor 1" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">System Active</option>
                  <option value="OUT_OF_SERVICE">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Usage Hours</label>
              <input type="text" name="availabilityWindows" value={formData.availabilityWindows} onChange={handleChange} required placeholder="08:00 AM - 05:00 PM" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Additional Remarks</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Notes for staff or users..." />
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
            <button type="submit" className="btn btn-primary flex-1 flex items-center justify-center gap-2 py-3 shadow-lg shadow-blue-900/10">
              <Save size={18} /> {facility ? 'Save Changes' : 'Confirm Registration'}
            </button>
            <button type="button" onClick={onCancel} className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityForm;
