import { useEffect, useState } from "react";

import "./ContentManagement.css";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSettings,
  FiFileText,
  FiUsers,
} from "react-icons/fi";

import {
  getContentItems,
  createContentItem,
  updateContentItem,
  deleteContentItem,
} from "../services/contentApi";

import RequestManagement from "../components/RequestManagement";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  image_url: "",
  status: "published",
};

function ContentManagement({ onClose }) {
  const [activeSection, setActiveSection] = useState("content");

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const data = await getContentItems();

      setItems(data);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateContentItem(editingId, form);
      } else {
        await createContentItem(form);
      }

      await fetchItems();

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: item.image_url || "",
      status: item.status,
    });

    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this content?"
    );

    if (!confirmed) return;

    try {
      await deleteContentItem(id);

      await fetchItems();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="content-management-overlay"
      onClick={handleOverlayClick}
    >
      <div className="content-management-card">

        {/* Header */}
        <div className="content-management-top">
          <div className="content-management-title">
            <div className="content-management-title-icon">
              <FiSettings />
            </div>

            <div>
              <h2>Admin Management</h2>
              <p>Manage your website and customer requests</p>
            </div>
          </div>

          <button
            className="content-management-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {/* Admin Navigation */}
        <div className="admin-section-tabs">
          <button
            type="button"
            className={`admin-section-tab ${
              activeSection === "content" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSection("content");
              setShowForm(false);
            }}
          >
            <FiFileText />
            Content Management
          </button>

          <button
            type="button"
            className={`admin-section-tab ${
              activeSection === "requests" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSection("requests");
              setShowForm(false);
            }}
          >
            <FiUsers />
            Customer Requests
          </button>
        </div>

        {/* Content Management */}
        {activeSection === "content" && (
          <div className="content-management-body">

            {/* Add Button */}
            {!showForm && (
              <button
                className="content-submit-button"
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                  setShowForm(true);
                }}
              >
                <FiPlus />
                Add New Content
              </button>
            )}

            {/* Form */}
            {showForm && (
              <div className="content-form">
                <div className="content-form-header">
                  <h3>
                    {editingId
                      ? "Edit Content"
                      : "Add New Content"}
                  </h3>

                  <button
                    className="content-management-close"
                    onClick={closeForm}
                    type="button"
                  >
                    <FiX />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="content-form-group">
                    <label>Title</label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter title"
                      required
                    />
                  </div>

                  <div className="content-form-group">
                    <label>Category</label>

                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g. Web Development"
                      required
                    />
                  </div>

                  <div className="content-form-group">
                    <label>Description</label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter description"
                      required
                    />
                  </div>

                  <div className="content-form-group">
                    <label>Image URL</label>

                    <input
                      type="url"
                      name="image_url"
                      value={form.image_url}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="content-form-group">
                    <label>Status</label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="published">
                        Published
                      </option>

                      <option value="draft">
                        Draft
                      </option>
                    </select>
                  </div>

                  <div className="content-form-actions">
                    <button
                      type="button"
                      className="content-cancel-button"
                      onClick={closeForm}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="content-submit-button"
                    >
                      {editingId
                        ? "Update Content"
                        : "Create Content"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Content List */}
            <div className="content-items-section">
              <div className="content-items-header">
                <h3>Current Content</h3>

                <span className="content-items-count">
                  {items.length}{" "}
                  {items.length === 1
                    ? "item"
                    : "items"}
                </span>
              </div>

              {loading ? (
                <div className="content-loading">
                  Loading content...
                </div>
              ) : items.length === 0 ? (
                <div className="content-empty">
                  No content available.
                </div>
              ) : (
                items.map((item, index) => (
                  <article
                    className="content-item"
                    key={item.id}
                  >
                    <div className="content-item-info">
                      <div className="content-item-meta">
                        <span className="content-item-number">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="content-item-category">
                          {item.category}
                        </span>
                      </div>

                      <h4>{item.title}</h4>

                      <p>{item.description}</p>
                    </div>

                    <div className="content-item-actions">
                      <button
                        className="content-edit-button"
                        onClick={() =>
                          handleEdit(item)
                        }
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        className="content-delete-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {/* Customer Requests */}
        {activeSection === "requests" && (
          <div className="admin-request-section">
            <RequestManagement />
          </div>
        )}

      </div>
    </div>
  );
}

export default ContentManagement;