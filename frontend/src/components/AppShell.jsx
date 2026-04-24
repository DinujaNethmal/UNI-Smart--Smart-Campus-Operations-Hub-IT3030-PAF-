import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, PlusSquare, CalendarCheck, Settings,
  GraduationCap, Bell, ChevronDown, LogOut,
  Menu, Building2, Ticket, CheckCheck, X
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import {
  getMyNotifications,
  getUnreadNotifications,
  markNotificationAsRead
} from '../api/notificationApi';

function formatNotificationType(type) {
  const typeLabels = {
    BOOKING_CREATED: 'Booking created',
    BOOKING_CANCELLED: 'Booking cancelled',
    BOOKING_APPROVED: 'Booking approved',
    BOOKING_REJECTED: 'Booking rejected',
    ADMIN_BOOKING_CREATED: 'User booking created',
    ADMIN_BOOKING_CANCELLED: 'User booking cancelled',
  };

  return (
    typeLabels[type] ||
    type.replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function formatNotificationTime(timestamp) {
  return new Intl.DateTimeFormat('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

export default function AppShell() {
  const { user, isAdmin, isAuthenticated, logout, loading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [toastNotification, setToastNotification] = useState(null);
  const [toastQueue, setToastQueue] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const dropRef = useRef(null);
  const notificationRef = useRef(null);

  const hasLoadedNotificationsRef = useRef(false);
  const seenNotificationIdsRef = useRef(new Set());

  useEffect(() => {
    const close = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadNotificationsSnapshot() {
      if (!isAuthenticated) {
        setUnreadCount(0);
        setRecentNotifications([]);
        setToastNotification(null);
        seenNotificationIdsRef.current = new Set();
        hasLoadedNotificationsRef.current = false;
        return;
      }

      try {
        const [unread, all] = await Promise.all([
          getUnreadNotifications(),
          getMyNotifications(),
        ]);

        if (!isMounted) return;

        setUnreadCount(unread.length);
        setRecentNotifications(all.slice(0, 10));

        const nextIds = new Set(all.map((i) => i.id));

        if (hasLoadedNotificationsRef.current) {
          const freshUnread = all.filter(
            (i) => !seenNotificationIdsRef.current.has(i.id) && !i.read
          );

          if (freshUnread.length > 0) {
            setToastQueue((current) => [
              ...current,
              ...freshUnread
            ]);
          }
        } else {
          hasLoadedNotificationsRef.current = true;
        }

        seenNotificationIdsRef.current = nextIds;
      } catch {
        if (!isMounted) return;
        setUnreadCount(0);
      }
    }

    loadNotificationsSnapshot();
    const intervalId = setInterval(loadNotificationsSnapshot, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    setNotificationMenuOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const initials =
    user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2) || 'GU';

  return (
    <div className="app-shell">

      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">SC</div>
          <div className="topbar-title">
            Smart Campus <small>Operations Hub</small>
          </div>
        </div>
      </header>

      <aside className="sidebar">

        <NavLink to="/" end className="sidebar-link">
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <div className="sidebar-section">Catalogue</div>

        <NavLink to="/facilities" className="sidebar-link">
          <Building2 size={18} /> Campus Catalogue
        </NavLink>

        <div className="sidebar-section">Bookings</div>

        <NavLink to="/my-bookings" className="sidebar-link">
          <CalendarCheck size={18} /> My Bookings
        </NavLink>

        <NavLink to="/notifications" className="sidebar-link">
          <Bell size={18} /> Notifications
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className="sidebar-link">
            <Settings size={18} /> Manage Bookings
          </NavLink>
        )}

        <div className="sidebar-section">Tickets</div>

        <NavLink to="/tickets" className="sidebar-link">
          <Ticket size={18} /> Manage Tickets
        </NavLink>

        {/* ✅ FIXED FOOTER (THIS WAS BROKEN BEFORE) */}
        <div
          className="sidebar-footer"
          style={{
            marginTop: 'auto',
            borderTop: '1px solid var(--slate-100)',
            padding: '16px 8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GraduationCap size={14} />
            SLIIT - Faculty of Computing
          </div>

          <div style={{ marginTop: 2 }}>
            IT3030 PAF 2026
          </div>
        </div>

      </aside>

      <main className="main">
        <Outlet />
      </main>

    </div>
  );
}