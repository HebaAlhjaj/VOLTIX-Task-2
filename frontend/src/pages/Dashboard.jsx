import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
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
        throw new Error(data.detail || "Failed to update profile");
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
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

        <div className="dashboard-header">
          <div>
            <p className="dashboard-label">
              CUSTOMER DASHBOARD
            </p>

            <h1>
              Welcome, {user?.name}
            </h1>

            <p>
              Manage your account information.
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
      </div>
    </div>
  );
}

export default Dashboard;