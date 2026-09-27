import { useEffect, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";

import {
  getAllRequests,
  updateRequestStatus,
} from "../services/requestApi";

function RequestManagement() {
  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // -----------------------------------------------
  // Load requests from Backend
  // -----------------------------------------------

  async function loadRequests(filters = {}) {
    try {
      setLoading(true);
      setError("");

      const data = await getAllRequests(filters);

      setRequests(data);
    } catch (err) {
      setError(
        err.message || "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------------------
  // Initial load
  // -----------------------------------------------

  useEffect(() => {
    loadRequests();
  }, []);

  // -----------------------------------------------
  // Search + Filters
  // -----------------------------------------------

  function handleSearch(event) {
    const value = event.target.value;

    setSearch(value);

    loadRequests({
      search: value,
      status: statusFilter,
      service: serviceFilter,
    });
  }

  function handleStatusFilter(event) {
    const value = event.target.value;

    setStatusFilter(value);

    loadRequests({
      search,
      status: value,
      service: serviceFilter,
    });
  }

  function handleServiceFilter(event) {
    const value = event.target.value;

    setServiceFilter(value);

    loadRequests({
      search,
      status: statusFilter,
      service: value,
    });
  }

  // -----------------------------------------------
  // Reset filters
  // -----------------------------------------------

  function handleResetFilters() {
    setSearch("");
    setStatusFilter("");
    setServiceFilter("");

    loadRequests();
  }

  // -----------------------------------------------
  // Refresh
  // -----------------------------------------------

  function handleRefresh() {
    loadRequests({
      search,
      status: statusFilter,
      service: serviceFilter,
    });
  }

  // -----------------------------------------------
  // Update request status
  // -----------------------------------------------

  async function handleStatusChange(
    requestId,
    newStatus
  ) {
    try {
      setUpdatingId(requestId);
      setError("");

      const updatedRequest =
        await updateRequestStatus(
          requestId,
          newStatus
        );

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId
            ? updatedRequest
            : request
        )
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to update request"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // -----------------------------------------------
  // Status class
  // -----------------------------------------------

  function getStatusClass(status) {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  // -----------------------------------------------
  // Loading
  // -----------------------------------------------

  if (loading) {
    return (
      <div className="request-management">
        <div className="admin-section-header">
          <div>
            <span className="admin-section-label">
              CUSTOMER REQUESTS
            </span>

            <h2>Request Management</h2>

            <p>
              Search, filter and manage customer
              requests.
            </p>
          </div>
        </div>

        <div className="admin-loading">
          Loading requests...
        </div>
      </div>
    );
  }

  return (
    <div className="request-management">
      {/* ----------------------------------------- */}
      {/* HEADER */}
      {/* ----------------------------------------- */}

      <div className="admin-section-header">
        <div>
          <span className="admin-section-label">
            CUSTOMER REQUESTS
          </span>

          <h2>Request Management</h2>

          <p>
            Search and filter customer requests
            from the database.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={handleRefresh}
          title="Refresh requests"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* ----------------------------------------- */}
      {/* SEARCH & FILTERS */}
      {/* ----------------------------------------- */}

      <div className="request-search-panel">
        <div className="request-search-header">
          <div className="request-search-title">
            <FiFilter />

            <div>
              <h3>Search & Filters</h3>

              <p>
                Find requests using multiple criteria.
              </p>
            </div>
          </div>
        </div>

        <div className="request-filters">
          {/* Search */}

          <div className="request-search-input">
            <FiSearch />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by subject, service or description..."
            />

            {search && (
              <button
                type="button"
                className="request-clear-search"
                onClick={() => {
                  setSearch("");

                  loadRequests({
                    search: "",
                    status: statusFilter,
                    service: serviceFilter,
                  });
                }}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Status */}

          <div className="request-filter-group">
            <label htmlFor="request-status-filter">
              Status
            </label>

            <select
              id="request-status-filter"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="">
                All Statuses
              </option>

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
          </div>

          {/* Service */}

          <div className="request-filter-group">
            <label htmlFor="request-service-filter">
              Service
            </label>

            <select
              id="request-service-filter"
              value={serviceFilter}
              onChange={handleServiceFilter}
            >
              <option value="">
                All Services
              </option>

              {[
                ...new Set(
                  requests
                    .map(
                      (request) =>
                        request.service
                    )
                    .filter(Boolean)
                ),
              ].map((service) => (
                <option
                  value={service}
                  key={service}
                >
                  {service}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}

          {(search ||
            statusFilter ||
            serviceFilter) && (
            <button
              type="button"
              className="request-reset-button"
              onClick={handleResetFilters}
            >
              <FiX />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------- */}
      {/* ERROR */}
      {/* ----------------------------------------- */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* ----------------------------------------- */}
      {/* RESULT COUNT */}
      {/* ----------------------------------------- */}

      <div className="admin-request-count">
        <strong>{requests.length}</strong>{" "}
        {requests.length === 1
          ? "Request"
          : "Requests"}{" "}
        found
      </div>

      {/* ----------------------------------------- */}
      {/* EMPTY STATE */}
      {/* ----------------------------------------- */}

      {requests.length === 0 ? (
        <div className="admin-empty-state">
          <FiSearch />

          <h3>
            No Requests Found
          </h3>

          <p>
            Try changing your search or filter
            criteria.
          </p>

          {(search ||
            statusFilter ||
            serviceFilter) && (
            <button
              type="button"
              className="request-reset-button"
              onClick={handleResetFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* --------------------------------------- */
        /* REQUEST LIST */
        /* --------------------------------------- */

        <div className="admin-requests-list">
          {requests.map((request) => (
            <div
              className="admin-request-item"
              key={request.id}
            >
              {/* TOP */}

              <div className="admin-request-top">
                <div>
                  <span className="admin-request-id">
                    REQUEST #{request.id}
                  </span>

                  <h3>
                    {request.subject}
                  </h3>

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

              {/* DESCRIPTION */}

              <p className="admin-request-description">
                {request.description}
              </p>

              {/* INFO */}

              <div className="admin-request-info">
                <div>
                  <span>
                    Customer ID
                  </span>

                  <strong>
                    {request.user_id}
                  </strong>
                </div>

                <div>
                  <span>
                    Created
                  </span>

                  <strong>
                    {new Date(
                      request.created_at
                    ).toLocaleDateString()}
                  </strong>
                </div>

                <div>
                  <span>
                    Updated
                  </span>

                  <strong>
                    {new Date(
                      request.updated_at
                    ).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              {/* STATUS UPDATE */}

              <div className="admin-request-actions">
                <label
                  htmlFor={`status-${request.id}`}
                >
                  Update Status
                </label>

                <select
                  id={`status-${request.id}`}
                  value={request.status}
                  disabled={
                    updatingId ===
                    request.id
                  }
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

                {updatingId ===
                  request.id && (
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
