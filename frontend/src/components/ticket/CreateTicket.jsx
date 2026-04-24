import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  AlertCircle,
  FileText,
  Tag,
  MapPin,
  Flag,
  User,
  Phone,
  Mail,
  Upload
} from "lucide-react";

export default function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    resource: "",
    description: "",
    priority: "",
    name: "",
    phone: "",
    email: ""
  });

  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetch("http://localhost:8081/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      navigate("/tickets-list");
    } catch (err) {
      setError("Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Back */}
      <Link to="/" className="page-back">
        <FaArrowLeft size={14} /> Back
      </Link>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Ticket</h1>
          <div className="page-subtitle">
            Submit a new incident or maintenance request
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="form-card">

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category *</label>
          <div className="form-input-wrap">
            <Tag size={16} className="input-icon" />
            <select
              name="category"
              value={formData.category}
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
          <label className="form-label">Title *</label>
          <div className="form-input-wrap">
            <FileText size={16} className="input-icon" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Brief summary of the issue"
              required
            />
          </div>
        </div>

        {/* Resource */}
        <div className="form-group">
          <label className="form-label">Location *</label>
          <div className="form-input-wrap">
            <MapPin size={16} className="input-icon" />
            <input
              type="text"
              name="resource"
              value={formData.resource}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Building A - Room 301"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Provide detailed information about the issue..."
            rows={4}
            required
          />
        </div>

        

        {/* Priority */}
        <div className="form-group">
          <label className="form-label">Priority *</label>
          <div className="form-input-wrap">
            <Flag size={16} className="input-icon" />
            <select
              name="priority"
              value={formData.priority}
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

        {/* Contact Section */}
        <div className="form-section-title">Contact Information</div>

        {/* Name */}
        <div className="form-group">
          <label className="form-label">Name *</label>
          <div className="form-input-wrap">
            <User size={16} className="input-icon" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">Phone *</label>
          <div className="form-input-wrap">
            <Phone size={16} className="input-icon" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email *</label>
          <div className="form-input-wrap">
            <Mail size={16} className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Info */}
        <div className="form-note">
          <strong>Note:</strong> Your ticket will be reviewed by the maintenance team.
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <Link to="/" className="btn btn-ghost btn-lg" style={{ flex: 1 }}>
            Cancel
          </Link>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>

      </form>
    </>
  );
}