import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    title: "",
    resource: "",
    description: "",
    priority: "",
    name: "",
    phone: "",
    email: "",
    status: "",
    assignedTo: ""
  });
  const [loading, setLoading] = useState(true);

  // Fetch existing ticket data
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/tickets/${id}`);
        if (!res.ok) throw new Error("Failed to fetch ticket");
        const data = await res.json();
        setForm({
          category: data.category || "",
          title: data.title || "",
          resource: data.resource || "",
          description: data.description || "",
          priority: data.priority || "",
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          status: data.status || "",
          assignedTo: data.assignedTo || ""
        });
      } catch (err) {
        alert("Error loading ticket: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8081/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update ticket");
      alert("Ticket updated successfully!");
      navigate(`/ticket-detail/${id}`);
    } catch (err) {
      alert("Error updating ticket: " + err.message);
    }
  };

  if (loading) return <p className="p-6">Loading ticket...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <h2 className="text-2xl font-bold mb-2">Edit Ticket</h2>
      <p className="text-gray-600 mb-6">Update incident or maintenance request</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select a category</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="IT">IT</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Resource */}
        <div>
          <label className="block font-medium">Resource/Location</label>
          <input
            type="text"
            name="resource"
            value={form.resource}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block font-medium">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select priority level</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block font-medium">Assign To</label>
          <input
            type="text"
            name="assignedTo"
            placeholder="Technician name"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Contact Info */}
        <h3 className="text-lg font-semibold mt-6">Contact Information</h3>

        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}