import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TicketList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [tickets, setTickets] = useState([]);   
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     

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

  const navigate = useNavigate();

  // Delete ticket
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await fetch(`http://localhost:8081/api/tickets/${id}`, { method: "DELETE" });
      setTickets(tickets.filter((t) => t.id !== id));
    } catch (err) {
      alert("Error deleting ticket");
    }
  };

  // Resolve ticket 
  const handleUpdateApi = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:8081/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const updated = await res.json();
      setTickets(tickets.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert("Error updating ticket");
    }
  };

  const handleNavigateUpdate = (id) => {
    navigate(`/ticket/${id}/edit`);
  };

  // Apply search + filters
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      t.resource?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || t.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "All" || t.priority?.toLowerCase() === priorityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Ticket List</h1>

      {loading && <p>Loading tickets...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          {/* Filters + Search */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by ID, title, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md p-2 w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>All</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
                <option>Rejected</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Ticket ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date Created</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{t.id}</td>
                    <td className="p-3">{t.title}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          t.priority?.toUpperCase() === "HIGH"
                            ? "bg-red-100 text-red-600"
                            : t.priority?.toUpperCase() === "MEDIUM"
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
                          t.status?.toUpperCase() === "OPEN"
                            ? "bg-red-100 text-red-600"
                            : t.status?.toUpperCase() === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-600"
                            : t.status?.toUpperCase() === "RESOLVED"
                            ? "bg-green-100 text-green-600"
                            : t.status?.toUpperCase() === "CLOSED"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3">{t.createdAt?.substring(0, 10)}</td>
                     <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleUpdateApi(t.id, { ...t, status: "RESOLVED" })}
                        className="px-3 py-1 text-sm rounded-md border border-green-600 text-green-600 hover:bg-green-50 transition"
                      >
                        Resolve
                      </button>

                      <button
                        onClick={() => navigate(`/ticket-detail/${t.id}`)}
                        className="px-3 py-1 text-sm rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-3 py-1 text-sm rounded-md border border-red-600 text-red-600 hover:bg-red-50 transition"
                      >
                        Delete
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

export default TicketList;