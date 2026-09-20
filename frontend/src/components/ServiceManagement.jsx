import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../services/servicesApi";

const emptyForm = {
  title: "",
  description: "",
  icon: "web",
  is_active: true,
};

function ServiceManagement({ onClose }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You must be logged in.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateService(editingId, form, token);
      } else {
        await createService(form, token);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadServices();

      // Update public Services section automatically
      window.dispatchEvent(new Event("servicesUpdated"));
    } catch (error) {
      console.error(error);
      alert("Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon || "web",
      is_active: service.is_active,
    });
  };

  const handleDelete = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You must be logged in.");
      return;
    }

    try {
      await deleteService(serviceId, token);
      await loadServices();

      // Update public Services section automatically
      window.dispatchEvent(new Event("servicesUpdated"));
    } catch (error) {
      console.error(error);
      alert("Failed to delete service.");
    }
  };

  return (
    <div className="service-management-overlay">
      <div className="service-management">
        <div className="service-management-header">
          <div>
            <p className="section-label">ADMIN</p>
            <h2>Service Management</h2>
            <p>
              Create, edit, and manage the services displayed on the website.
            </p>
          </div>

          <button
            type="button"
            className="service-management-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <form
          className="service-management-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="title"
            placeholder="Service title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Service description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
          />

          <select
            name="icon"
            value={form.icon}
            onChange={handleChange}
          >
            <option value="web">Web</option>
            <option value="design">Design</option>
            <option value="mobile">Mobile</option>
            <option value="software">Software</option>
          </select>

          <label className="service-active-toggle">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active service
          </label>

          <div className="service-form-actions">
            <button
              type="submit"
              disabled={saving}
            >
              <FiPlus />
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Add Service"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="service-management-list">
          <div className="service-list-heading">
            <h3>Current Services</h3>
            <span>{services.length} services</span>
          </div>

          {loading ? (
            <p>Loading services...</p>
          ) : services.length === 0 ? (
            <p>No services found.</p>
          ) : (
            services.map((service) => (
              <div
                className="service-management-item"
                key={service.id}
              >
                <div>
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>

                  <span>
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="service-item-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    aria-label="Edit service"
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    aria-label="Delete service"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceManagement;