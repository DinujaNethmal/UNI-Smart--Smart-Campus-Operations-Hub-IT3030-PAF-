import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolderOpen, FaSpinner, FaCheckCircle, FaLock } from "react-icons/fa";

function TicketDashboard() {
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // ✅ filter by clicking summary box
  const navigate = useNavigate();

  // Fetch tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/tickets");
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Filter tickets by search + status
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      t.status?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter || t.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // Status counts
  const statusCounts = {
    OPEN: tickets.filter((t) => t.status === "OPEN").length,
    IN_PROGRESS: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
    CLOSED: tickets.filter((t) => t.status === "CLOSED").length,
  };

  const statusBoxes = [
    { label: "Open", key: "OPEN", count: statusCounts.OPEN, icon: <FaFolderOpen className="text-red-600 text-2xl" /> },
    { label: "In Progress", key: "IN_PROGRESS", count: statusCounts.IN_PROGRESS, icon: <FaSpinner className="text-yellow-600 text-2xl" /> },
    { label: "Resolved", key: "RESOLVED", count: statusCounts.RESOLVED, icon: <FaCheckCircle className="text-green-600 text-2xl" /> },
    { label: "Closed", key: "CLOSED", count: statusCounts.CLOSED, icon: <FaLock className="text-gray-600 text-2xl" /> },
  ];

  return (
  
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Ticket Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Manage and track all campus maintenance tickets</h2>

      {loading   && <p>Loading tickets...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statusBoxes.map((box) => (
              <div
                key={box.key}
                onClick={() => setStatusFilter(box.key)} // ✅ click to filter
                className={`cursor-pointer bg-white shadow rounded-lg p-4 text-center hover:bg-blue-50 ${
                  statusFilter === box.key ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {box.icon}
                <p className="text-lg font-semibold text-gray-700 mt-2">{box.label}</p>
                <p className="text-2xl font-bold text-blue-600">{box.count}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate("/create-ticket")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"    
            >
              + Create Ticket
            </button>
            
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md p-2 w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {/* Tickets Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Ticket ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Assigned To</th>
                  <th className="p-3 text-left">Date Created</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{t.id}</td>
                    <td className="p-3">{t.title}</td>
                    <td className="p-3">{t.resource}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          t.priority === "HIGH"
                            ? "bg-red-100 text-red-600"
                            : t.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          t.status === "OPEN"
                            ? "bg-red-100 text-red-600"
                            : t.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-600"
                            : t.status === "RESOLVED"
                            ? "bg-green-100 text-green-600"
                            : t.status === "CLOSED"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3">{t.assignedTo || "Unassigned"}</td>
                    <td className="p-3">{t.createdAt?.substring(0, 10)}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => navigate(`/ticket-detail/${t.id}`)}
                        className="text-green-600 "
                      >
                        View
                      </button>
                      <br/>
                      <br/>

                      <button
                        onClick={() => navigate(`/ticket-edit/${t.id}`)}
                        className="text-blue-600 "
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default TicketDashboard;