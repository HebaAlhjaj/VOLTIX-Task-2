import { useEffect, useRef, useState } from "react";

import {
  FiFile,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";

import {
  createRequest,
  getMyRequests,
} from "../services/requestApi";

import {
  getMyFiles,
  uploadFile,
  deleteFile,
} from "../services/fileApi";

function Dashboard() {
  // ========================================
  // USER / PROFILE
  // ========================================

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

  // ========================================
  // SERVICE REQUESTS
  // ========================================

  const [requestForm, setRequestForm] = useState({
    service: "",
    subject: "",
    description: "",
  });

  const [requests, setRequests] = useState([]);

  const [requestsLoading, setRequestsLoading] =
    useState(true);

  const [submittingRequest, setSubmittingRequest] =
    useState(false);

  const [requestMessage, setRequestMessage] =
    useState("");

  const [requestError, setRequestError] =
    useState("");

  // ========================================
  // FILE MANAGEMENT
  // ========================================

  const [files, setFiles] = useState([]);

  const [filesLoading, setFilesLoading] =
    useState(true);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploadingFile, setUploadingFile] =
    useState(false);

  const [deletingFileId, setDeletingFileId] =
    useState(null);

  const [fileMessage, setFileMessage] =
    useState("");

  const [fileError, setFileError] =
    useState("");

  const fileInputRef = useRef(null);

  // ========================================
  // LOAD USER
  // ========================================

  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(
      "http://127.0.0.1:8000/api/users/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )
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
        localStorage.removeItem(
          "access_token"
        );

        window.location.href = "/login";
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ========================================
  // LOAD REQUESTS
  // ========================================

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setRequestsLoading(true);

      const data = await getMyRequests();

      setRequests(
        Array.isArray(data)
          ? data
          : data.requests || []
      );
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setRequestsLoading(false);
    }
  };

  // ========================================
  // LOAD FILES
  // ========================================

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setFilesLoading(true);

      const data = await getMyFiles();

      setFiles(
        Array.isArray(data)
          ? data
          : data.files || []
      );
    } catch (error) {
      setFileError(error.message);
    } finally {
      setFilesLoading(false);
    }
  };

  // ========================================
  // PROFILE HANDLERS
  // ========================================

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

    const token =
      localStorage.getItem("access_token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/me",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
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
          data.detail ||
            "Failed to update profile"
        );
      }

      setUser(data);

      setFormData({
        name: data.name,
        email: data.email,
      });

      setEditing(false);

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // REQUEST HANDLERS
  // ========================================

  const handleRequestChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value,
    });
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

  // ========================================
  // FILE HANDLERS
  // ========================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setSelectedFile(file || null);

    setFileMessage("");
    setFileError("");
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFileError(
        "Please select a file first."
      );

      return;
    }

    setUploadingFile(true);
    setFileMessage("");
    setFileError("");

    try {
      await uploadFile(selectedFile);

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setFileMessage(
        "File uploaded successfully."
      );

      await loadFiles();
    } catch (error) {
      setFileError(error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingFileId(fileId);
    setFileMessage("");
    setFileError("");

    try {
      await deleteFile(fileId);

      setFileMessage(
        "File deleted successfully."
      );

      await loadFiles();
    } catch (error) {
      setFileError(error.message);
    } finally {
      setDeletingFileId(null);
    }
  };

  // ========================================
  // HELPERS
  // ========================================

  const formatFileSize = (bytes) => {
    if (
      bytes === null ||
      bytes === undefined ||
      bytes === ""
    ) {
      return "-";
    }

    const numericBytes = Number(bytes);

    if (Number.isNaN(numericBytes)) {
      return "-";
    }

    if (numericBytes === 0) {
      return "0 Bytes";
    }

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.floor(
      Math.log(numericBytes) /
        Math.log(1024)
    );

    const size =
      numericBytes /
      Math.pow(1024, index);

    return `${size.toFixed(
      index === 0 ? 0 : 1
    )} ${units[index] || "GB"}`;
  };

  const getFileName = (file) => {
    return (
      file.original_filename ||
      file.filename ||
      file.name ||
      "Unnamed file"
    );
  };

  const getFileSize = (file) => {
    return (
      file.file_size ??
      file.size ??
      file.file_size_bytes
    );
  };

  const getFileType = (file) => {
    return (
      file.content_type ||
      file.mime_type ||
      "File"
    );
  };

  const getFileDate = (file) => {
    const date =
      file.created_at ||
      file.uploaded_at;

    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString();
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

  // ========================================
  // NAVIGATION
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "access_token"
    );

    window.location.href = "/login";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  // ========================================
  // DASHBOARD
  // ========================================

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-label">
              CUSTOMER DASHBOARD
            </p>

            <h1>
              Welcome, {user?.name}
            </h1>

            <p>
              Manage your account and service
              requests.
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

        {/* ========================================
            ACCOUNT INFORMATION
        ======================================== */}

        <div className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>
                Account Information
              </h2>

              <p>
                View and manage your personal
                information.
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

                <strong>
                  {user?.id}
                </strong>
              </div>

              <div>
                <span>Name</span>

                <strong>
                  {user?.name}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {user?.email}
                </strong>
              </div>

              <div>
                <span>
                  Account Created
                </span>

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
                <label>
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-input-group">
                <label>
                  Email
                </label>

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

        {/* ========================================
            FILE MANAGEMENT
        ======================================== */}

        <div className="request-card file-management-card">

          <div className="file-management-header">
            <div>
              <p className="dashboard-label">
                FILE MANAGEMENT
              </p>

              <h2>
                My Files
              </h2>

              <p>
                Upload and manage files
                associated with your account.
              </p>
            </div>
          </div>

          {fileMessage && (
            <div className="file-success-message">
              {fileMessage}
            </div>
          )}

          {fileError && (
            <div className="file-error-message">
              {fileError}
            </div>
          )}

          {/* Upload */}

          <form
            onSubmit={handleUploadFile}
          >
            <div className="file-upload-area">

              <div className="file-upload-info">
                <div className="file-upload-icon">
                  <FiUpload />
                </div>

                <div>
                  <strong>
                    Upload a new file
                  </strong>

                  <span>
                    Select a file from your
                    computer to upload.
                  </span>
                </div>
              </div>

              <div className="file-input-wrapper">

                <input
                  ref={fileInputRef}
                  id="dashboard-file-input"
                  className="file-input"
                  type="file"
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="dashboard-file-input"
                  className="file-select-button"
                >
                  <FiFile />

                  Choose File
                </label>

              </div>
            </div>

            {selectedFile && (
              <div className="selected-file">

                <div>
                  <div className="selected-file-name">
                    {selectedFile.name}
                  </div>

                  <div className="selected-file-size">
                    {formatFileSize(
                      selectedFile.size
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="file-upload-button"
                  disabled={uploadingFile}
                >
                  {uploadingFile
                    ? "Uploading..."
                    : "Upload File"}
                </button>

              </div>
            )}
          </form>

          {/* Files List */}

          <div className="files-list-header">
            <h3>
              Uploaded Files
            </h3>

            <span className="files-count">
              {files.length}{" "}
              {files.length === 1
                ? "file"
                : "files"}
            </span>
          </div>

          {filesLoading ? (
            <div className="files-loading">
              Loading your files...
            </div>
          ) : files.length === 0 ? (
            <div className="files-empty">

              <div className="files-empty-icon">
                <FiFile />
              </div>

              <h3>
                No files uploaded yet
              </h3>

              <p>
                Upload your first file using
                the area above.
              </p>

            </div>
          ) : (
            <div className="files-list">

              {files.map((file) => (
                <div
                  className="file-item"
                  key={file.id}
                >

                  <div className="file-item-info">

                    <div className="file-icon">
                      <FiFile />
                    </div>

                    <div className="file-details">

                      <strong>
                        {getFileName(file)}
                      </strong>

                      <span>
                        {getFileType(file)}
                        {" • "}
                        {formatFileSize(
                          getFileSize(file)
                        )}
                        {" • "}
                        {getFileDate(file)}
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="file-delete-button"
                    onClick={() =>
                      handleDeleteFile(
                        file.id
                      )
                    }
                    disabled={
                      deletingFileId ===
                      file.id
                    }
                    title="Delete file"
                  >
                    <FiTrash2 />
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* ========================================
            SUBMIT REQUEST
        ======================================== */}

        <div className="request-card">

          <div className="request-card-header">
            <div>
              <p className="dashboard-label">
                SERVICE REQUEST
              </p>

              <h2>
                Submit a Request
              </h2>

              <p>
                Tell us what you need and our
                team will review your request.
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
              <label>
                Service
              </label>

              <select
                name="service"
                value={requestForm.service}
                onChange={
                  handleRequestChange
                }
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
              <label>
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={requestForm.subject}
                onChange={
                  handleRequestChange
                }
                placeholder="What do you need?"
                required
              />
            </div>

            <div className="request-input-group request-full-width">
              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  requestForm.description
                }
                onChange={
                  handleRequestChange
                }
                placeholder="Describe your request..."
                rows="5"
                required
              />
            </div>

            <button
              type="submit"
              className="request-submit-button"
              disabled={
                submittingRequest
              }
            >
              {submittingRequest
                ? "Submitting..."
                : "Submit Request"}
            </button>
          </form>

        </div>

        {/* ========================================
            MY REQUESTS
        ======================================== */}

        <div className="request-card">

          <div className="request-card-header">
            <div>
              <p className="dashboard-label">
                REQUEST HISTORY
              </p>

              <h2>
                My Requests
              </h2>

              <p>
                Track the status of your
                submitted service requests.
              </p>
            </div>
          </div>

          {requestsLoading ? (
            <div className="requests-loading">
              Loading your requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-requests">
              <h3>
                No requests yet
              </h3>

              <p>
                Submit your first service
                request above.
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