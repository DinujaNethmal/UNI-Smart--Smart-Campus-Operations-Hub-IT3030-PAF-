import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  AlertCircle,
  FileText,
  Tag,
  MapPin,
  Flag,
  User,
  Phone,
  Mail
} from "lucide-react";

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://localhost:8081/api/tickets/${id}`);
        const data = await res.json();
        setForm(data);
      } catch (err) {
        setError("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8081/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      navigate(`/ticket-detail/${id}`);
    } catch (err) {
      setError("Failed to update ticket");
    }
  };

  if (loading) {
    return <div className="loading-text">Loading ticket...</div>;
  }

  return (
    <>

      {/* BACK */}
      <Link to="/tickets" className="page-back">
        <FaArrowLeft size={14} /> Back
      </Link>

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Ticket</h1>
          <div className="page-subtitle">
            Update incident or maintenance request
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="form-card">

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category </label>
          <div className="form-input-wrap">
            <Tag size={16} className="input-icon" />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select category</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="IT">IT</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Title </label>
          <div className="form-input-wrap">
            <FileText size={16} className="input-icon" />
            <input
              type="text"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Resource */}
        <div className="form-group">
          <label className="form-label">Location </label>
          <div className="form-input-wrap">
            <MapPin size={16} className="input-icon" />
            <input
              type="text"
              name="resource"
              value={form.resource || ""}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description </label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="form-textarea"
            rows={4}
            required
          />
        </div>

        {/* Priority */}
        <div className="form-group">
          <label className="form-label">Priority </label>
          <div className="form-input-wrap">
            <Flag size={16} className="input-icon" />
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">Status </label>
          <div className="form-input-wrap">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>


        {/* CONTACT SECTION */}
        <div className="form-section-title">Contact Information</div>

        <div className="form-group">
          <label className="form-label">Name </label>
          <div className="form-input-wrap">
            <User size={16} className="input-icon" />
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone </label>
          <div className="form-input-wrap">
            <Phone size={16} className="input-icon" />
            <input
              type="tel"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email </label>
          <div className="form-input-wrap">
            <Mail size={16} className="input-icon" />
            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg">
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-lg"
          >
            Cancel
          </button>
        </div>

      </form>
    </>
  );
}