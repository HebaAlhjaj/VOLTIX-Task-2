import { useEffect, useState } from "react";
import {
  getAllRequests,
  updateRequestStatus,
} from "../services/requestApi";

function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllRequests();
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleStatusChange(requestId, newStatus) {
    try {
      setUpdatingId(requestId);
      setError("");

      const updatedRequest = await updateRequestStatus(
        requestId,
        newStatus
      );

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId ? updatedRequest : request
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update request");
    } finally {
      setUpdatingId(null);
    }
  }

  function getStatusClass(status) {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  if (loading) {
    return (
      <div className="request-management">
        <div className="admin-section-header">
          <span className="admin-section-label">
            CUSTOMER REQUESTS
          </span>

          <h2>Request Management</h2>
          <p>Manage and follow customer requests.</p>
        </div>

        <div className="admin-loading">
          Loading requests...
        </div>
      </div>
    );
  }

  return (
    <div className="request-management">
      <div className="admin-section-header">
        <div>
          <span className="admin-section-label">
            CUSTOMER REQUESTS
          </span>

          <h2>Request Management</h2>

          <p>
            View customer requests and update their status.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadRequests}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      <div className="admin-request-count">
        <strong>{requests.length}</strong>{" "}
        {requests.length === 1 ? "Request" : "Requests"}
      </div>

      {requests.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No Customer Requests</h3>
          <p>
            Customer requests will appear here when they are submitted.
          </p>
        </div>
      ) : (
        <div className="admin-requests-list">
          {requests.map((request) => (
            <div
              className="admin-request-item"
              key={request.id}
            >
              <div className="admin-request-top">
                <div>
                  <span className="admin-request-id">
                    REQUEST #{request.id}
                  </span>

                  <h3>{request.subject}</h3>

                  <span className="admin-request-service">
                    {request.service}
                  </span>
                </div>

                <span
                  className={`admin-request-status ${getStatusClass(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>

              <p className="admin-request-description">
                {request.description}
              </p>

              <div className="admin-request-info">
                <div>
                  <span>Customer ID</span>
                  <strong>{request.user_id}</strong>
                </div>

                <div>
                  <span>Created</span>
                  <strong>
                    {new Date(
                      request.created_at
                    ).toLocaleDateString()}
                  </strong>
                </div>

                <div>
                  <span>Updated</span>
                  <strong>
                    {new Date(
                      request.updated_at
                    ).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              <div className="admin-request-actions">
                <label htmlFor={`status-${request.id}`}>
                  Update Status
                </label>

                <select
                  id={`status-${request.id}`}
                  value={request.status}
                  disabled={updatingId === request.id}
                  onChange={(event) =>
                    handleStatusChange(
                      request.id,
                      event.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>

                {updatingId === request.id && (
                  <span className="admin-updating">
                    Updating...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RequestManagement;





