import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, PlusSquare, CalendarCheck, Settings,
  GraduationCap, Bell, ChevronDown, LogOut, Menu, Building2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AppShell({ children }) {
  const { user, isAdmin, switchRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSwitch = (key) => {
    switchRole(key);
    setMenuOpen(false);
    navigate(key === 'admin' ? '/admin' : '/');
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className="app-shell">
      {/* ===== Top Bar ===== */}
      <header className="topbar">
        <button className="topbar-icon-btn" style={{ display: 'none' }}><Menu size={18} /></button>
        <div className="topbar-brand">
          <div className="topbar-logo">SC</div>
          <div className="topbar-title">
            Smart Campus
            <small>Operations Hub</small>
          </div>
        </div>
        <div className="topbar-spacer" />
        <div className="topbar-actions">
          <button className="topbar-icon-btn">
            <Bell size={18} />
            <span className="topbar-badge">4</span>
          </button>
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button className="topbar-user" onClick={() => setMenuOpen(o => !o)}>
              <div className="topbar-avatar">{initials}</div>
              <div className="topbar-user-info">
                <div className="topbar-user-name">{user.name}</div>
                <div className="topbar-user-role">{user.role}</div>
              </div>
              <ChevronDown size={14} color="var(--slate-400)" />
            </button>
            {menuOpen && (
              <div className="role-dropdown">
                <div className="role-dropdown-label">Switch Demo Role</div>
                <button className="role-dropdown-item" onClick={() => handleSwitch('student')}>
                  <strong>Demo Student</strong>
                  <span>View and create bookings</span>
                </button>
                <button className="role-dropdown-item" onClick={() => handleSwitch('admin')}>
                  <strong>Demo Admin</strong>
                  <span>Approve or reject requests</span>
                </button>
                <div className="role-dropdown-footer">
                  Auth stub for Module B. OAuth via Module E.
                </div>
              </div>
            )}
          </div>
          <button className="topbar-icon-btn"><LogOut size={18} /></button>
        </div>
      </header>

      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <div className="sidebar-section">Catalogue</div>
        <NavLink to="/facilities" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Building2 size={18} /> Campus Catalogue
        </NavLink>

        <div className="sidebar-section">Bookings</div>
        <NavLink to="/my-bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <CalendarCheck size={18} /> My Bookings
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Settings size={18} /> Manage Bookings
          </NavLink>
        )}

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GraduationCap size={14} />
            SLIIT — Faculty of Computing
          </div>
          <div style={{ marginTop: 2 }}>IT3030 PAF 2026</div>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="main">{children}</main>
    </div>
  );
}
