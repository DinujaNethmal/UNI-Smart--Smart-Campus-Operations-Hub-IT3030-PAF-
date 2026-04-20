import { useEffect, useState } from 'react';
import { Plus, Search, MapPin, Users } from 'lucide-react';
import { getFacilities, deleteFacility } from '../../api/catalogueApi';
import FacilityCard from '../../components/catalogue/FacilityCard';
import { useAuth } from '../../hooks/useAuth';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await deleteFacility(id);
        setFacilities(prev => prev.filter(f => f.id !== id));
      } catch (error) {
        alert('Failed to delete facility');
      }
    }
  };

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Facilities & Assets</h1>
          <div className="page-subtitle">Browse and manage campus locations and equipment.</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary">
            <Plus size={18} /> Add Facility
          </button>
        )}
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="search-bar" style={{ margin: 12 }}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, type, or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              onEdit={(fac) => alert('Edit feature coming in the next commit!')}
            />
          ))}
        </div>
      )}
    </>
  );
}
