import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CheckCheck,
  ChevronRight,
  X,
  MailOpen,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import {
  deleteNotification,
  getMyNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
} from '../api/notificationApi';

function formatType(type) {
  const typeLabels = {
    BOOKING_CREATED: 'Booking created',
    BOOKING_CANCELLED: 'Booking canceled',
    BOOKING_APPROVED: 'Booking approved',
    BOOKING_REJECTED: 'Booking rejected',
    ADMIN_BOOKING_CREATED: 'User booking created',
    ADMIN_BOOKING_CANCELLED: 'User booking canceled',
  };

  return typeLabels[type] || type.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatWhen(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getDateBucketLabel(timestamp) {
  const value = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const diffDays = Math.round((startOfToday - startOfTarget) / 86400000);

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return 'Earlier This Week';
  }
  return new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium' }).format(value);
}

export default function NotificationsPage() {
  const [tab, setTab] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');
  const [bulkWorking, setBulkWorking] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  async function loadNotifications(selectedTab = tab) {
    setLoading(true);
    try {
      const data = selectedTab === 'unread'
        ? await getUnreadNotifications()
        : await getMyNotifications();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications(tab);
  }, [tab]);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.read).length,
    [items]
  );

  const typeOptions = useMemo(() => {
    const uniqueTypes = [...new Set(items.map((item) => item.type))];
    return ['ALL', ...uniqueTypes];
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const nextItems = items.filter((item) => {
      const matchesQuery = !normalizedQuery
        || item.title.toLowerCase().includes(normalizedQuery)
        || item.message.toLowerCase().includes(normalizedQuery)
        || formatType(item.type).toLowerCase().includes(normalizedQuery);

      const matchesType = typeFilter === 'ALL' || item.type === typeFilter;

      return matchesQuery && matchesType;
    });

    nextItems.sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return sortOrder === 'newest' ? rightTime - leftTime : leftTime - rightTime;
    });

    return nextItems;
  }, [items, query, typeFilter, sortOrder]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((groups, item) => {
      const bucket = getDateBucketLabel(item.createdAt);
      if (!groups[bucket]) {
        groups[bucket] = [];
      }
      groups[bucket].push(item);
      return groups;
    }, {});
  }, [filteredItems]);

  const visibleUnreadCount = useMemo(
    () => filteredItems.filter((item) => !item.read).length,
    [filteredItems]
  );

  const selectedNotification = useMemo(
    () => filteredItems.find((item) => item.id === selectedNotificationId) || null,
    [filteredItems, selectedNotificationId]
  );

  const thisWeekCount = useMemo(() => {
    const now = new Date();
    return items.filter((item) => (now - new Date(item.createdAt)) / 86400000 < 7).length;
  }, [items]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedNotificationId(null);
      return;
    }

    if (selectedNotificationId && !filteredItems.some((item) => item.id === selectedNotificationId)) {
      setSelectedNotificationId(null);
    }
  }, [filteredItems, selectedNotificationId]);

  const handleMarkAsRead = async (id) => {
    setWorkingId(id);
    try {
      await markNotificationAsRead(id);
      await loadNotifications(tab);
    } finally {
      setWorkingId(null);
    }
  };

  const handleDelete = async (id) => {
    setWorkingId(id);
    try {
      await deleteNotification(id);
      await loadNotifications(tab);
    } finally {
      setWorkingId(null);
    }
  };

  const handleMarkVisibleAsRead = async () => {
    const unreadVisible = filteredItems.filter((item) => !item.read);
    if (unreadVisible.length === 0) {
      return;
    }

    setBulkWorking(true);
    try {
      await Promise.all(unreadVisible.map((item) => markNotificationAsRead(item.id)));
      await loadNotifications(tab);
    } finally {
      setBulkWorking(false);
    }
  };

  const handleClearReadVisible = async () => {
    const readVisible = filteredItems.filter((item) => item.read);
    if (readVisible.length === 0) {
      return;
    }

    setBulkWorking(true);
    try {
      await Promise.all(readVisible.map((item) => deleteNotification(item.id)));
      await loadNotifications(tab);
    } finally {
      setBulkWorking(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <div className="page-subtitle">Track booking, ticket, and system updates from one place.</div>
        </div>
      </div>

      <div className="panel">
        <div className="tabs">
          <button
            className={`tab ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
            type="button"
          >
            All Notifications
          </button>
          <button
            className={`tab ${tab === 'unread' ? 'active' : ''}`}
            onClick={() => setTab('unread')}
            type="button"
          >
            Unread {tab === 'unread' ? `(${items.length})` : ''}
          </button>
        </div>

        <div className="panel-body">
          <div className="notification-summary">
            <div className="notification-summary-card">
              <Bell size={18} />
              <div>
                <strong>{filteredItems.length}</strong>
                <span>Visible in this view</span>
              </div>
            </div>
            <div className="notification-summary-card">
              <MailOpen size={18} />
              <div>
                <strong>{visibleUnreadCount}</strong>
                <span>Still unread</span>
              </div>
            </div>
            <div className="notification-summary-card">
              <RefreshCcw size={18} />
              <div>
                <strong>{thisWeekCount}</strong>
                <span>Received this week</span>
              </div>
            </div>
          </div>

          <div className="notification-toolbar">
            <div className="notification-search">
              <Search size={16} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, message, or type"
              />
            </div>

            <div className="notification-filters">
              <div className="notification-filter-group">
                <SlidersHorizontal size={15} />
                <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type === 'ALL' ? 'All types' : formatType(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="notification-filter-group">
                <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => loadNotifications(tab)}
                disabled={loading || bulkWorking}
              >
                <RefreshCcw size={16} /> Refresh
              </button>
            </div>
          </div>

          <div className="notification-bulk-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleMarkVisibleAsRead}
              disabled={bulkWorking || visibleUnreadCount === 0}
            >
              <CheckCheck size={16} /> Mark visible as read
            </button>
            <button
              type="button"
              className="btn btn-danger-text"
              onClick={handleClearReadVisible}
              disabled={bulkWorking || !filteredItems.some((item) => item.read)}
            >
              <Trash2 size={16} /> Clear read notifications
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-state-title">Loading notifications...</div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Bell size={28} /></div>
              <div className="empty-state-title">No notifications found</div>
              <div className="empty-state-sub">Try changing the filters or wait for new updates from the backend.</div>
            </div>
          ) : (
            <div className="notification-groups">
              {Object.entries(groupedItems).map(([bucket, bucketItems]) => (
                <section key={bucket} className="notification-group">
                  <div className="notification-group-header">{bucket}</div>
                  <div className="notification-list">
                    {bucketItems.map((notification) => (
                      <article
                        key={notification.id}
                        className={`notification-card notification-card-clickable ${notification.read ? 'is-read' : 'is-unread'} ${selectedNotificationId === notification.id ? 'is-selected' : ''}`}
                        onClick={() => setSelectedNotificationId(notification.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setSelectedNotificationId(notification.id);
                          }
                        }}
                      >
                        <div className="notification-card-main">
                          <div className="notification-card-header">
                            <div>
                              <div className="notification-card-meta">
                                <span className={`notification-chip ${notification.read ? 'read' : 'unread'}`}>
                                  {notification.read ? 'Read' : 'Unread'}
                                </span>
                                <span className="notification-chip neutral">{formatType(notification.type)}</span>
                              </div>
                              <h3 className="notification-card-title">{notification.title}</h3>
                            </div>
                            <div className="notification-card-time">{formatWhen(notification.createdAt)}</div>
                          </div>
                          <p className="notification-card-message">{notification.message}</p>
                        </div>

                        <div className="notification-card-footer">
                          <span className="notification-preview-hint">Click to preview</span>
                          <ChevronRight size={16} />
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedNotification && (
        <div
          className="notification-preview-overlay"
          onClick={() => setSelectedNotificationId(null)}
          role="presentation"
        >
          <div
            className="notification-preview-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-preview-title"
          >
            <div className="notification-preview-header">
              <div>
                <div className="notification-card-meta">
                  <span className={`notification-chip ${selectedNotification.read ? 'read' : 'unread'}`}>
                    {selectedNotification.read ? 'Read' : 'Unread'}
                  </span>
                  <span className="notification-chip neutral">{formatType(selectedNotification.type)}</span>
                </div>
                <h3 id="notification-preview-title" className="notification-preview-title">{selectedNotification.title}</h3>
                <div className="notification-preview-time">{formatWhen(selectedNotification.createdAt)}</div>
              </div>
              <button
                type="button"
                className="notification-preview-close"
                onClick={() => setSelectedNotificationId(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="notification-preview-body">
              <p>{selectedNotification.message}</p>
            </div>

            <div className="notification-card-actions">
              {!selectedNotification.read && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleMarkAsRead(selectedNotification.id)}
                  disabled={workingId === selectedNotification.id || bulkWorking}
                >
                  <CheckCheck size={16} /> Mark as read
                </button>
              )}
              <button
                type="button"
                className="btn btn-danger-text"
                onClick={() => handleDelete(selectedNotification.id)}
                disabled={workingId === selectedNotification.id || bulkWorking}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
