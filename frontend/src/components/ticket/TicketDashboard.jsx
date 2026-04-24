import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaFolderOpen,
  FaSpinner,
  FaCheckCircle,
  FaLock
} from "react-icons/fa";

import { AlertCircle, PlusSquare, Search } from "lucide-react";

export default function TicketDashboard() {
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toString().includes(search);

    const matchesStatus =
      !statusFilter || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const open = tickets.filter(t => t.status === "OPEN").length;
  const inProgress = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter(t => t.status === "RESOLVED").length;
  const closed = tickets.filter(t => t.status === "CLOSED").length;

  return (
    <>

      {/* HEADER (same as booking dashboard) */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Ticket Dashboard</h1>
          <div className="page-subtitle">
            Manage and track all maintenance tickets
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading && <div className="empty-state">Loading tickets...</div>}

      {!loading && !error && (
        <>

          {/* STATS (same structure as booking dashboard) */}
          <div className="stats-grid">

            <div
              className={`stat-card ${statusFilter === "OPEN" ? "active" : ""}`}
              onClick={() =>
                setStatusFilter(statusFilter === "OPEN" ? "" : "OPEN")
              }
            >
              <div className="stat-icon blue"><FaFolderOpen /></div>
              <div className="stat-value">{open}</div>
              <div className="stat-label">Open</div>
            </div>

            <div
              className={`stat-card ${statusFilter === "IN_PROGRESS" ? "active" : ""}`}
              onClick={() =>
                setStatusFilter(statusFilter === "IN_PROGRESS" ? "" : "IN_PROGRESS")
              }
            >
              <div className="stat-icon yellow"><FaSpinner /></div>
              <div className="stat-value">{inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>

            <div
              className={`stat-card ${statusFilter === "RESOLVED" ? "active" : ""}`}
              onClick={() =>
                setStatusFilter(statusFilter === "RESOLVED" ? "" : "RESOLVED")
              }
            >
              <div className="stat-icon green"><FaCheckCircle /></div>
              <div className="stat-value">{resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>

            <div
              className={`stat-card ${statusFilter === "CLOSED" ? "active" : ""}`}
              onClick={() =>
                setStatusFilter(statusFilter === "CLOSED" ? "" : "CLOSED")
              }
            >
              <div className="stat-icon red"><FaLock /></div>
              <div className="stat-value">{closed}</div>
              <div className="stat-label">Closed</div>
            </div>

          </div>

          {/* TOOLBAR (same style as booking quick actions area) */}
          <div className="toolbar">

            <button
              onClick={() => navigate("/create-ticket")}
              className="btn btn-primary btn-lg"
            >
              <PlusSquare size={16} /> Create Ticket
            </button>

          </div><br/>

          {/* Updated Search Bar */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 shadow-inner">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by name, type, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div><br/>

          {/* PANEL (same as booking recent panel) */}
          <div className="panel">

            <div className="panel-header">
              <div className="panel-title">Tickets</div>
              <Link to="/tickets" className="panel-link">
                View All
              </Link>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="empty-state">No tickets found</div>
            ) : (
              filteredTickets.slice(0, 5).map((t) => (
                <div key={t.id} className="booking-item">

                  <div className="booking-item-header">
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        #{t.id} - {t.title}
                      </div>
                      <div className="text-muted">
                        {t.resource}
                      </div>
                    </div>

                    <span className={`badge status-${t.status}`}>
                      {t.status}
                    </span>
                  </div>

                  <div style={{ marginTop: 8, fontSize: "13px", color: "#64748b" }}>
                    Priority:{" "}
                    <span className={`badge priority-${t.priority}`}>
                      {t.priority}
                    </span>
                  </div>

                  <div className="booking-actions flex gap-3 mt-3">
                    <button
                      onClick={() => navigate(`/ticket-detail/${t.id}`)}
                      className="px-3 py-1 text-sm "
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/ticket-edit/${t.id}`)}
                      className="px-3 py-1 text-sm  text-blue-600 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}

          </div>

        </>
      )}
    </>
  );
}