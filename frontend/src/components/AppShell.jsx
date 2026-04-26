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
            setToastQueue((current) => {
              const existingIds = new Set(current.map((item) => item.id));
              if (toastNotification) {
                existingIds.add(toastNotification.id);
              }
              const nextFresh = freshUnread.filter((item) => !existingIds.has(item.id));
              return [...current, ...nextFresh];
            });
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
  }, [isAuthenticated, toastNotification]);

  useEffect(() => {
    setNotificationMenuOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!toastNotification) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToastNotification(null);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [toastNotification]);

  useEffect(() => {
    if (!toastNotification && toastQueue.length > 0) {
      const [nextToast, ...rest] = toastQueue;
      setToastNotification(nextToast);
      setToastQueue(rest);
    }
  }, [toastNotification, toastQueue]);

  const handleQuickRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setRecentNotifications((current) => current.map((item) => (
        item.id === notificationId ? { ...item, read: true } : item
      )));
      setUnreadCount((current) => Math.max(0, current - 1));
      if (toastNotification?.id === notificationId) {
        setToastNotification(null);
      }
    } catch {
      // Keep the current UI state if the quick action fails.
    }
  };

  const initials =
    user?.name?.split(' ').map((w) => w[0]).join('').slice(0, 2) || 'GU';

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="notification-toast" role="status" aria-live="polite">
          <div className="notification-toast-copy">
            <div className="notification-toast-label">New notification</div>
            <div className="notification-toast-title">{toastNotification.title}</div>
            <div className="notification-toast-message">{toastNotification.message}</div>
          </div>
          <div className="notification-toast-actions">
            {!toastNotification.read && (
              <button
                type="button"
                className="notification-toast-action"
                onClick={() => handleQuickRead(toastNotification.id)}
              >
                <CheckCheck size={14} /> Read
              </button>
            )}
            <button
              type="button"
              className="notification-toast-close"
              onClick={() => setToastNotification(null)}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">SC</div>
          <div className="topbar-title">
            Smart Campus <small>Operations Hub</small>
          </div>
        </div>
        
        {/* ✅ ADDED: Spacer and Actions */}
        <div className="topbar-spacer" />
        
        <div className="topbar-actions">
          {/* Notification Bell */}
          <div ref={notificationRef} style={{ position: 'relative' }}>
            <button 
              className="topbar-icon-btn" 
              onClick={() => setNotificationMenuOpen((open) => !open)}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="topbar-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notification Dropdown */}
            {notificationMenuOpen && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  <div>
                    <div className="notification-dropdown-title">Recent notifications</div>
                    <div className="notification-dropdown-subtitle">Latest 10 updates</div>
                  </div>
                  {unreadCount > 0 && (
                    <span className="notification-dropdown-pill">{unreadCount} unread</span>
                  )}
                </div>

                <div className="notification-dropdown-list">
                  {recentNotifications.length === 0 ? (
                    <div className="notification-dropdown-empty">No notifications yet.</div>
                  ) : (
                    recentNotifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`notification-dropdown-item ${item.read ? '' : 'is-unread'}`}
                        onClick={() => {
                          setNotificationMenuOpen(false);
                          navigate('/notifications');
                        }}
                      >
                        <div className="notification-dropdown-item-top">
                          <span className="notification-dropdown-item-title">{item.title}</span>
                          <span className="notification-dropdown-item-time">
                            {formatNotificationTime(item.createdAt)}
                          </span>
                        </div>
                        <div className="notification-dropdown-item-type">
                          {formatNotificationType(item.type)}
                        </div>
                        <div className="notification-dropdown-item-message">{item.message}</div>
                        {!item.read && <span className="notification-dropdown-dot" />}
                      </button>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  className="notification-dropdown-link"
                  onClick={() => {
                    setNotificationMenuOpen(false);
                    navigate('/notifications');
                  }}
                >
                  See all notifications
                </button>
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          {!loading && isAuthenticated ? (
            <>
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button 
                  className="topbar-user" 
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <div className="topbar-avatar">{initials}</div>
                  <div className="topbar-user-info">
                    <div className="topbar-user-name">{user.name}</div>
                    <div className="topbar-user-role">{user.role}</div>
                  </div>
                  <ChevronDown size={14} color="var(--slate-400)" />
                </button>
                
                {menuOpen && (
                  <div className="role-dropdown">
                    <div className="role-dropdown-label">{user.email}</div>
                    <div className="role-dropdown-footer">
                      Signed in with {user.provider}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                className="topbar-icon-btn"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button className="topbar-auth-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
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
          {unreadCount > 0 && <span className="sidebar-link-dot" />}
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