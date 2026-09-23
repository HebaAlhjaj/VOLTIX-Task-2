import { useEffect, useState } from "react";
import {
  createRequest,
  getMyRequests,
} from "../services/requestApi";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [requestForm, setRequestForm] = useState({
    service: "",
    subject: "",
    description: "",
  });

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://127.0.0.1:8000/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        return response.json();
      })
      .then((data) => {
        setUser(data);

        setFormData({
          name: data.name,
          email: data.email,
        });
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setRequestsLoading(true);

      const data = await getMyRequests();

      setRequests(data);
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRequestChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
    setError("");
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    });

    setEditing(false);
    setMessage("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update profile"
        );
      }

      setUser(data);

      setFormData({
        name: data.name,
        email: data.email,
      });

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    setSubmittingRequest(true);
    setRequestMessage("");
    setRequestError("");

    try {
      await createRequest(requestForm);

      setRequestForm({
        service: "",
        subject: "",
        description: "",
      });

      setRequestMessage(
        "Your request has been submitted successfully."
      );

      await loadRequests();
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "request-status completed";

      case "In Progress":
        return "request-status in-progress";

      case "Rejected":
        return "request-status rejected";

      default:
        return "request-status pending";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <p className="dashboard-label">
              CUSTOMER DASHBOARD
            </p>

            <h1>
              Welcome, {user?.name}
            </h1>

            <p>
              Manage your account and service requests.
            </p>
          </div>

          <div className="dashboard-header-actions">
            <button
              className="back-home-button"
              onClick={handleBackToHome}
            >
              ← Back to Home
            </button>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>


        {/* Account Information */}
        <div className="profile-card">

          <div className="profile-card-header">
            <div>
              <h2>Account Information</h2>

              <p>
                View and manage your personal information.
              </p>
            </div>

            {!editing && (
              <button
                className="edit-profile-button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {!editing ? (
            <div className="profile-info">

              <div>
                <span>User ID</span>
                <strong>{user?.id}</strong>
              </div>

              <div>
                <span>Name</span>
                <strong>{user?.name}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{user?.email}</strong>
              </div>

              <div>
                <span>Account Created</span>
                <strong>
                  {user?.created_at
                    ? new Date(
                        user.created_at
                      ).toLocaleDateString()
                    : "-"}
                </strong>
              </div>

            </div>
          ) : (
            <form
              className="profile-edit-form"
              onSubmit={handleSave}
            >

              <div className="profile-input-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-input-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>
          )}

        </div>


        {/* Submit Request */}
        <div className="request-card">

          <div className="request-card-header">
            <div>
              <p className="dashboard-label">
                SERVICE REQUEST
              </p>

              <h2>Submit a Request</h2>

              <p>
                Tell us what you need and our team will
                review your request.
              </p>
            </div>
          </div>

          {requestMessage && (
            <div className="success-message">
              {requestMessage}
            </div>
          )}

          {requestError && (
            <div className="profile-error">
              {requestError}
            </div>
          )}

          <form
            className="request-form"
            onSubmit={handleSubmitRequest}
          >

            <div className="request-input-group">
              <label>Service</label>

              <select
                name="service"
                value={requestForm.service}
                onChange={handleRequestChange}
                required
              >
                <option value="">
                  Select a service
                </option>

                <option value="Web Development">
                  Web Development
                </option>

                <option value="UI/UX Design">
                  UI/UX Design
                </option>

                <option value="Mobile Development">
                  Mobile Development
                </option>

                <option value="Digital Solutions">
                  Digital Solutions
                </option>
              </select>
            </div>


            <div className="request-input-group">
              <label>Subject</label>

              <input
                type="text"
                name="subject"
                value={requestForm.subject}
                onChange={handleRequestChange}
                placeholder="What do you need?"
                required
              />
            </div>


            <div className="request-input-group request-full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={requestForm.description}
                onChange={handleRequestChange}
                placeholder="Describe your request..."
                rows="5"
                required
              />
            </div>


            <button
              type="submit"
              className="request-submit-button"
              disabled={submittingRequest}
            >
              {submittingRequest
                ? "Submitting..."
                : "Submit Request"}
            </button>

          </form>

        </div>


        {/* My Requests */}
        <div className="request-card">

          <div className="request-card-header">
            <div>
              <p className="dashboard-label">
                REQUEST HISTORY
              </p>

              <h2>My Requests</h2>

              <p>
                Track the status of your submitted service
                requests.
              </p>
            </div>
          </div>


          {requestsLoading ? (
            <div className="requests-loading">
              Loading your requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-requests">
              <h3>No requests yet</h3>

              <p>
                Submit your first service request above.
              </p>
            </div>
          ) : (
            <div className="requests-list">

              {requests.map((request) => (
                <div
                  className="request-item"
                  key={request.id}
                >

                  <div className="request-item-main">

                    <div>
                      <span className="request-service">
                        {request.service}
                      </span>

                      <h3>
                        {request.subject}
                      </h3>

                      <p>
                        {request.description}
                      </p>
                    </div>

                    <span
                      className={getStatusClass(
                        request.status
                      )}
                    >
                      {request.status}
                    </span>

                  </div>

                  <div className="request-item-footer">
                    <span>
                      Request #{request.id}
                    </span>

                    <span>
                      {request.created_at
                        ? new Date(
                            request.created_at
                          ).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;

