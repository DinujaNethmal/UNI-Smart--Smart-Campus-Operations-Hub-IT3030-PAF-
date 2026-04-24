import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TicketList() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/tickets")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tickets");
        return res.json();
      })
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ✅ DELETE TICKET
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:8081/api/tickets/${id}`, {
      method: "DELETE",
    });

    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <p className="empty-state">Loading tickets...</p>;
  if (error) return <p className="empty-state">{error}</p>;

  return (
    <div className="ticket-page">

      {/* HEADER */}
      <div className="page-header">
        <h1>Ticket List</h1>
      </div>

      {/* TABLE */}
      <div className="ticket-card">

        <table className="ticket-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>

                <td>#{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.resource}</td>

                <td>
                  <span className={`badge priority-${ticket.priority}`}>
                    {ticket.priority}
                  </span>
                </td>

                <td>
                  <span className={`badge status-${ticket.status}`}>
                    {ticket.status}
                  </span>
                </td>

                <td>{ticket.createdAt?.substring(0, 10)}</td>

                <td className="ticket-actions">

                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/ticket-detail/${ticket.id}`)}
                  >
                    View
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/ticket-edit/${ticket.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(ticket.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}