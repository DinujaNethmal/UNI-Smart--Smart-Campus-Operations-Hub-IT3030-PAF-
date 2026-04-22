import { useEffect, useState } from 'react';
import { Plus, Search, MapPin, Users } from 'lucide-react';
import { getFacilities, deleteFacility, createFacility, updateFacility } from '../../api/catalogueApi';
import FacilityCard from '../../components/catalogue/FacilityCard';
import FacilityForm from '../../components/catalogue/FacilityForm';
import { useAuth } from '../../hooks/useAuth';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [minCapacity, setMinCapacity] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const data = await getFacilities();
      setFacilities(data);
    } catch (error) {
      console.error('Failed to load facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingFacility) {
        await updateFacility(editingFacility.id, formData);
      } else {
        await createFacility(formData);
      }
      setShowForm(false);
      setEditingFacility(null);
      loadFacilities();
    } catch (error) {
      alert('Failed to save facility');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        setDeleting(true);
        await deleteFacility(id);
        setFacilities(prev => prev.filter(f => f.id !== id));
      } catch (error) {
        alert('Failed to delete facility');
      } finally {
        setDeleting(false);
      }
    }
  };

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || f.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchesCapacity = !minCapacity || f.capacity >= parseInt(minCapacity);
    
    return matchesSearch && matchesType && matchesStatus && matchesCapacity;
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Facilities & Assets</h1>
          <div className="page-subtitle">Browse and manage campus locations and equipment.</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={18} /> Add Facility
          </button>
        )}
      </div>

      {showForm && (
        <FacilityForm 
          facility={editingFacility}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingFacility(null);
          }}
        />
      )}

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="form-grid" style={{ padding: 20 }}>
          <div className="form-row" style={{ alignItems: 'flex-end' }}>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name, type, or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Type</label>
              <select 
                className="input"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="LECTURE_HALL">Lecture Halls</option>
                <option value="LAB">Laboratories</option>
                <option value="MEETING_ROOM">Meeting Rooms</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Status</label>
              <select 
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0, maxWidth: 120 }}>
              <label className="label">Min Pax</label>
              <input 
                type="number" 
                className="input" 
                placeholder="Capacity" 
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading catalogue...</div>
      ) : filteredFacilities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No facilities found</div>
          <div className="empty-state-sub">Try searching for something else or add a new one.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredFacilities.map(f => (
            <FacilityCard 
              key={f.id} 
              facility={f} 
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onEdit={(fac) => {
                setEditingFacility(fac);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
