import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiBriefcase,
  FiMail,
  FiPhone,
} from "react-icons/fi";

import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../services/clientApi";

import "./ClientManagement.css";

function ClientManagement({ currentUser }) {
  const isAdmin =
    currentUser?.is_admin === true ||
    currentUser?.role?.toLowerCase() === "admin";

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      loadClients();
    }
  }, [currentUser]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getClients();

      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      description: "",
    });

    setEditingClient(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenCreate = () => {
    setEditingClient(null);

    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      description: "",
    });

    setError("");
    setMessage("");
    setShowModal(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);

    setFormData({
      name: client.name || "",
      company: client.company || "",
      email: client.email || "",
      phone: client.phone || "",
      description: client.description || "",
    });

    setError("");
    setMessage("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Client name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingClient) {
        await updateClient(
          editingClient.id,
          formData
        );

        setMessage("Client updated successfully.");
      } else {
        await createClient(formData);

        setMessage("Client created successfully.");
      }

      await loadClients();

      setTimeout(() => {
        resetForm();
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (clientId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(clientId);
      setError("");
      setMessage("");

      await deleteClient(clientId);

      setClients((prev) =>
        prev.filter((client) => client.id !== clientId)
      );

      setMessage("Client deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="client-management-card">
      <div className="client-management-header">
        <div>
          <p className="dashboard-label">
            CLIENT MANAGEMENT
          </p>

          <h2>Clients</h2>

          <p>
            Create and manage clients for your projects.
          </p>
        </div>

        <button
          className="client-add-button"
          onClick={handleOpenCreate}
        >
          <FiPlus />
          New Client
        </button>
      </div>

      {message && (
        <div className="client-success">
          {message}
        </div>
      )}

      {error && (
        <div className="client-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="client-loading">
          Loading clients...
        </div>
      ) : clients.length === 0 ? (
        <div className="clients-empty">
          <div className="clients-empty-icon">
            <FiBriefcase />
          </div>

          <h3>No clients yet</h3>

          <p>
            Create your first client to start managing
            projects.
          </p>

          <button
            className="client-empty-button"
            onClick={handleOpenCreate}
          >
            <FiPlus />
            Create Client
          </button>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => (
            <div
              className="client-card"
              key={client.id}
            >
              <div className="client-card-top">
                <div className="client-icon">
                  <FiBriefcase />
                </div>

                <div className="client-actions">
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenEdit(client)
                    }
                    title="Edit client"
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(client.id)
                    }
                    disabled={
                      deletingId === client.id
                    }
                    title="Delete client"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <h3>{client.name}</h3>

              {client.company && (
                <p className="client-company">
                  {client.company}
                </p>
              )}

              {client.email && (
                <div className="client-detail">
                  <FiMail />
                  <span>{client.email}</span>
                </div>
              )}

              {client.phone && (
                <div className="client-detail">
                  <FiPhone />
                  <span>{client.phone}</span>
                </div>
              )}

              {client.description && (
                <p className="client-description">
                  {client.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="client-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetForm();
            }
          }}
        >
          <div className="client-modal">
            <div className="client-modal-header">
              <div>
                <p className="dashboard-label">
                  {editingClient
                    ? "EDIT CLIENT"
                    : "NEW CLIENT"}
                </p>

                <h2>
                  {editingClient
                    ? "Edit Client"
                    : "Create Client"}
                </h2>
              </div>

              <button
                type="button"
                className="client-close-button"
                onClick={resetForm}
              >
                <FiX />
              </button>
            </div>

            {error && (
              <div className="client-error">
                {error}
              </div>
            )}

            <form
              className="client-form"
              onSubmit={handleSubmit}
            >
              <div className="client-form-group">
                <label>Client Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div className="client-form-group">
                <label>Company</label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                />
              </div>

              <div className="client-form-row">
                <div className="client-form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="client@example.com"
                  />
                </div>

                <div className="client-form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+962..."
                  />
                </div>
              </div>

              <div className="client-form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add client details..."
                  rows="4"
                />
              </div>

              <div className="client-form-actions">
                <button
                  type="button"
                  className="client-cancel-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="client-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingClient
                    ? "Save Changes"
                    : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientManagement;