import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/tickets/${id}`);
        if (!res.ok) throw new Error("Failed to fetch ticket");
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <p className="p-6">Loading ticket...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!ticket) return <p className="p-6">Ticket not found</p>;

  // Normalize images safely
  const images =
    ticket.images ||
    ticket.imageUrls ||
    ticket.attachments ||
    [];

  console.log(ticket);
  console.log("TICKET:", ticket);
  console.log("IMAGES:", ticket.images);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-black hover:text-gray-700 mb-4"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <h2 className="text-2xl font-bold mb-2">Ticket Details</h2>
      <p className="text-gray-600 mb-6">
        View full information about this ticket
      </p>

      {/* Details */}
      <div className="space-y-4">

        <div><span className="font-semibold">Ticket ID:</span> {ticket.id}</div>
        <div><span className="font-semibold">Title:</span> {ticket.title}</div>
        <div><span className="font-semibold">Category:</span> {ticket.category}</div>
        <div><span className="font-semibold">Resource/Location:</span> {ticket.resource}</div>
        <div><span className="font-semibold">Description:</span> {ticket.description}</div>
        
        {ticket.images && ticket.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Attached Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {ticket.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-48 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <span className="font-semibold">Priority:</span>{" "}
          <span
            className={`px-2 py-1 rounded text-sm ${
              ticket.priority === "HIGH"
                ? "bg-red-100 text-red-600"
                : ticket.priority === "MEDIUM"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {ticket.priority}
          </span>
        </div>

        <div>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded text-sm ${
              ticket.status === "OPEN"
                ? "bg-red-100 text-red-600"
                : ticket.status === "IN_PROGRESS"
                ? "bg-yellow-100 text-yellow-600"
                : ticket.status === "RESOLVED"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {ticket.status}
          </span>
        </div>

        <div>
          <span className="font-semibold">Assigned To:</span>{" "}
          {ticket.assignedTo || "Unassigned"}
        </div>

        <div>
          <span className="font-semibold">Created At:</span>{" "}
          {ticket.createdAt?.substring(0, 10)}
        </div>

        <div>
          <span className="font-semibold">Contact:</span>{" "}
          {ticket.name} ({ticket.phone}, {ticket.email})
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => navigate(`/ticket-edit/${ticket.id}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Ticket
        </button>

        <button
          onClick={() => navigate("/tickets-list")}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Back to List
        </button>
      </div>
    </div>
  );
}
