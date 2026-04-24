import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function CreateTicket({ onTicketCreated }) {
  const [form, setForm] = useState({
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // max 3
    setImages(files);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8081/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const savedTicket = await res.json();
      alert("Ticket submitted!");
      navigate("/dashboard"); // navigate only after success
    } catch (err) {
      alert("Error submitting ticket");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-black-600 hover:text-black-800 mb-4"
      >
        <FaArrowLeft />
        <span>Back</span>
      </button>

      <h2 className="text-2xl font-bold mb-2">Create New Ticket</h2>
      <p className="text-gray-600 mb-6">Submit a new incident or maintenance request</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Brief summary of the issue"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Resource/Location</label>
          <input
            type="text"
            name="resource"
            placeholder="e.g. Building A - Room 301"
            value={form.resource}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Provide detailed information about the issue..."
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

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

        <div>
          <label className="block font-medium">Upload Images (Max 3)</label>

          {/* Upload Box */}
          <div
            className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer ${
              images.length >= 3
                ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                : "border-gray-300 hover:border-blue-500"
            }`}
            onClick={() => {
              if (images.length < 3) {
                document.getElementById("fileInput").click();
              }
            }}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M24 8v32m16-16H8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex text-sm text-gray-600 justify-center">
                <span className="font-medium text-blue-600">
                  {images.length >= 3
                    ? "Maximum 3 images reached"
                    : "Click to upload or drag and drop"}
                </span>
              </div>

              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Hidden Input */}
          <input
            id="fileInput"
            type="file"
            accept="image/png,image/jpeg"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);

              // limit to 3 images total
              const total = [...images, ...files].slice(0, 3);
              setImages(total);
            }}
            className="hidden"
          />

          {/* Preview Images */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((file, idx) => (
                <div
                  key={idx}
                  className="relative border rounded-lg p-2 text-center bg-white shadow"
                >
                  {/* Image */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-24 w-full object-cover rounded"
                  />

                  {/* Name */}
                  <p className="text-xs mt-2 text-gray-600 truncate">
                    {file.name}
                  </p>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mt-6">Contact Information</h3>

        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
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
            placeholder="(555) 123-4567"
            value={form.phone}
            onChange={handleChange}
            required
            pattern="^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$"
            title="Enter a valid phone number (e.g. 555-123-4567)"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="your.email@campus.edu"
            value={form.email}
            onChange={handleChange}
            required
            title="Enter a valid email address"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Ticket
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
