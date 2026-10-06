import { useEffect, useMemo, useState } from "react";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiPauseCircle,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectApi";

import { getClients } from "../services/clientApi";
import { getTeamMembers } from "../services/teamApi";

import "./ProjectManagement.css";

const STATUSES = [
  "Not Started",
  "In Progress",
  "Completed",
  "On Hold",
];

function ProjectManagement({ currentUser }) {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Not Started",
    progress: 0,
    client_id: "",
    member_ids: [],
  });

  const isAdmin =
    currentUser?.is_admin === true ||
    currentUser?.role?.toLowerCase() === "admin";

  // Load projects, clients, and team members
  useEffect(() => {
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load projects
      const projectsData = await getProjects();
      setProjects(
        Array.isArray(projectsData) ? projectsData : []
      );

      // Admin data
      if (isAdmin) {
        // Load clients separately
        try {
          const clientsData = await getClients();

          setClients(
            Array.isArray(clientsData)
              ? clientsData
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load clients:",
            err
          );

          setClients([]);
        }

        // Load team members separately
        try {
          const membersData = await getTeamMembers();

          setTeamMembers(
            Array.isArray(membersData)
              ? membersData
              : []
          );
        } catch (err) {
          console.error(
            "Failed to load team members:",
            err
          );

          setTeamMembers([]);
        }
      }
    } catch (err) {
      console.error(
        "Failed to load projects:",
        err
      );

      setError(
        err.message ||
          "Failed to load project data"
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: projects.length,

      inProgress: projects.filter(
        (project) =>
          project.status === "In Progress"
      ).length,

      completed: projects.filter(
        (project) =>
          project.status === "Completed"
      ).length,

      onHold: projects.filter(
        (project) =>
          project.status === "On Hold"
      ).length,
    };
  }, [projects]);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      status: "Not Started",
      progress: 0,
      client_id: "",
      member_ids: [],
    });

    setEditingProject(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingProject(null);

    setForm({
      name: "",
      description: "",
      status: "Not Started",
      progress: 0,
      client_id: "",
      member_ids: [],
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);

    setForm({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "Not Started",
      progress: project.progress ?? 0,
      client_id: project.client_id || "",
      member_ids:
        project.members?.map(
          (member) => member.id
        ) || [],
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        name === "progress"
          ? Number(value)
          : name === "client_id"
          ? Number(value)
          : value,
    }));
  };

  const handleMemberChange = (event) => {
    const selectedIds = Array.from(
      event.target.selectedOptions,
      (option) => Number(option.value)
    );

    setForm((prev) => ({
      ...prev,
      member_ids: selectedIds,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      if (!form.name.trim()) {
        setError("Project name is required.");
        return;
      }

      if (!form.client_id) {
        setError("Please select a client.");
        return;
      }

      const projectData = {
        name: form.name.trim(),
        description:
          form.description.trim() || null,
        status: form.status,
        progress: Number(form.progress),
        client_id: Number(form.client_id),
        member_ids: form.member_ids,
      };

      if (editingProject) {
        await updateProject(
          editingProject.id,
          projectData
        );

        setMessage(
          "Project updated successfully."
        );
      } else {
        await createProject(projectData);

        setMessage(
          "Project created successfully."
        );
      }

      await loadData();

      resetForm();
    } catch (err) {
      console.error(
        "Project save error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong."
      );
    }
  };

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteProject(projectId);

      setProjects((prev) =>
        prev.filter(
          (project) =>
            project.id !== projectId
        )
      );

      setMessage(
        "Project deleted successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete project."
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "completed";

      case "In Progress":
        return "in-progress";

      case "On Hold":
        return "on-hold";

      default:
        return "not-started";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FiCheckCircle />;

      case "In Progress":
        return <FiClock />;

      case "On Hold":
        return <FiPauseCircle />;

      default:
        return <FiAlertCircle />;
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(
      (item) => item.id === clientId
    );

    return (
      client?.name ||
      client?.company ||
      `Client #${clientId}`
    );
  };

  if (loading) {
    return (
      <section className="project-management">
        <div className="project-loading">
          Loading projects...
        </div>
      </section>
    );
  }

  return (
    <section className="project-management">
      {/* Header */}
      <div className="project-header">
        <div>
          <span className="project-eyebrow">
            PROJECT MANAGEMENT
          </span>

          <h2>Client Projects</h2>

          <p>
            Manage projects, track progress, and
            keep your team organized.
          </p>
        </div>

        {isAdmin && (
          <button
            className="project-primary-btn"
            onClick={openCreateForm}
          >
            <FiPlus />
            New Project
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="project-alert error">
          <FiAlertCircle />
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="project-alert success">
          <FiCheckCircle />
          {message}
        </div>
      )}

      {/* Statistics */}
      <div className="project-stats">
        <div className="project-stat-card">
          <div className="project-stat-icon">
            <FiBriefcase />
          </div>

          <div>
            <span>Total Projects</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="project-stat-card">
          <div className="project-stat-icon">
            <FiClock />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{stats.inProgress}</strong>
          </div>
        </div>

        <div className="project-stat-card">
          <div className="project-stat-icon">
            <FiCheckCircle />
          </div>

          <div>
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
        </div>

        <div className="project-stat-card">
          <div className="project-stat-icon">
            <FiPauseCircle />
          </div>

          <div>
            <span>On Hold</span>
            <strong>{stats.onHold}</strong>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="empty-projects">
          <FiBriefcase />

          <h3>No projects yet</h3>

          <p>
            {isAdmin
              ? "Create your first client project to get started."
              : "You don't have any assigned projects yet."}
          </p>

          {isAdmin && (
            <button
              className="project-primary-btn"
              onClick={openCreateForm}
            >
              <FiPlus />
              Create Project
            </button>
          )}
        </div>
      ) : (
        /* Projects */
        <div className="projects-grid">
          {projects.map((project) => (
            <article
              className="project-card"
              key={project.id}
            >
              <div className="project-card-top">
                <span
                  className={`project-status ${getStatusClass(
                    project.status
                  )}`}
                >
                  {getStatusIcon(
                    project.status
                  )}

                  {project.status}
                </span>

                {isAdmin && (
                  <div className="project-actions">
                    <button
                      onClick={() =>
                        openEditForm(project)
                      }
                      title="Edit project"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          project.id
                        )
                      }
                      title="Delete project"
                      className="delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>

              <h3>{project.name}</h3>

              <p className="project-description">
                {project.description ||
                  "No description provided."}
              </p>

              {/* Client */}
              <div className="project-client">
                <FiBriefcase />

                <span>
                  {isAdmin
                    ? getClientName(
                        project.client_id
                      )
                    : `Client #${project.client_id}`}
                </span>
              </div>

              {/* Progress */}
              <div className="project-progress">
                <div className="progress-header">
                  <span>Progress</span>

                  <strong>
                    {project.progress}%
                  </strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="project-members">
                <div className="members-title">
                  <FiUsers />
                  <span>Team Members</span>
                </div>

                {project.members?.length > 0 ? (
                  <div className="member-list">
                    {project.members.map(
                      (member) => (
                        <div
                          className="member-item"
                          key={member.id}
                        >
                          <div className="member-avatar">
                            {member.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {member.name}
                            </strong>

                            <span>
                              {member.role}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="no-members">
                    No team members assigned.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && isAdmin && (
        <div className="project-modal-overlay">
          <div className="project-modal">
            {/* Modal Header */}
            <div className="project-modal-header">
              <div>
                <span className="project-eyebrow">
                  {editingProject
                    ? "EDIT PROJECT"
                    : "NEW PROJECT"}
                </span>

                <h3>
                  {editingProject
                    ? "Update Project"
                    : "Create Project"}
                </h3>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={resetForm}
              >
                <FiX />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Project Name */}
              <div className="form-group">
                <label>Project Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the project..."
                  rows="4"
                />
              </div>

              {/* Client + Status */}
              <div className="form-row">
                <div className="form-group">
                  <label>Client</label>

                  <select
                    name="client_id"
                    value={form.client_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select client
                    </option>

                    {clients.map((client) => (
                      <option
                        key={client.id}
                        value={client.id}
                      >
                        {client.name}

                        {client.company
                          ? ` — ${client.company}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    {STATUSES.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress */}
              <div className="form-group">
                <div className="range-label">
                  <label>Progress</label>

                  <strong>
                    {form.progress}%
                  </strong>
                </div>

                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={handleChange}
                />
              </div>

              {/* Team Members */}
              <div className="form-group">
                <label>
                  Assign Team Members
                </label>

                <select
                  multiple
                  value={form.member_ids}
                  onChange={handleMemberChange}
                  className="members-select"
                >
                  {teamMembers.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.name} —{" "}
                      {member.email}
                    </option>
                  ))}
                </select>

                <small>
                  Hold Ctrl while selecting
                  multiple members.
                </small>
              </div>

              {/* Buttons */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="project-primary-btn"
                >
                  {editingProject
                    ? "Save Changes"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectManagement;