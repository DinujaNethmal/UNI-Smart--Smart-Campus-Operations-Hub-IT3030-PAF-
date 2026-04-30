import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ GET DATA FROM BACKEND
  useEffect(() => {
    fetch(`http://localhost:8081/api/tickets/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch ticket");
        return res.json();
      })
      .then((data) => {
        setTicket(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // LOADING
  if (loading) return <p className="empty-state">Loading ticket...</p>;

  // ERROR
  if (error) return <p className="empty-state">{error}</p>;

  // NOT FOUND
  if (!ticket) return <p className="empty-state">Ticket not found</p>;

  // ✅ STATUS UPDATE (FRONTEND ONLY FOR NOW)
  const updateStatus = (status) => {
    setTicket((prev) => ({
      ...prev,
      status,
    }));

    // 👉 later you can call backend API here
    //fetch(`http://localhost:8081/api/tickets/${id}/status`, {...})
  };

  return (
    <div className="ticket-page">

      {/* BACK */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* CARD */}
      <div className="ticket-card">

        <h2>{ticket.title}</h2>
        <p className="ticket-id">{ticket.id}</p>

        {/* GRID */}
        <div className="ticket-grid">

          <div>
            <label>Status</label>
            <span className={`badge ${ticket.status?.toLowerCase()}`}>
              {ticket.status}
            </span>
          </div>

          <div>
            <label>Priority</label>
            <span>{ticket.priority}</span>
          </div>

          <div>
            <label>Category</label>
            <span>{ticket.category}</span>
          </div>

          <div>
            <label>Location</label>
            <span>{ticket.resource}</span>
          </div>

          <div>
            <label>Created Date</label>
            <span>{ticket.createdAt?.substring(0, 10)}</span>
          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="ticket-desc">
          <label>Description</label>
          <p>{ticket.description}</p>
        </div>

        {/* CONTACT */}
        <div className="ticket-contact">
          <p><b>Name:</b> {ticket.name}</p>
          <p><b>Email:</b> {ticket.email}</p>
          <p><b>Phone:</b> {ticket.phone}</p>
        </div>

        {/* IMAGES */}
        {ticket.images?.length > 0 && (
          <div className="ticket-images">
            {ticket.images.map((img, i) => (
              <img key={i} src={img} alt="attachment" />
            ))}
          </div>
        )}



        {/* ACTIONS */}
        <div className="ticket-actions">

          <button
            className="btn-primary"
            onClick={() => updateStatus("IN_PROGRESS")}
          >
            Mark In Progress
          </button>

          <button
            className="btn-resolve"
            onClick={() => updateStatus("RESOLVED")}
          >
            Mark Resolved
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/tickets-list")}
          >
            Back to List
          </button>

        </div>

      </div>
    </div>
  );
}