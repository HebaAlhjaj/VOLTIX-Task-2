import { useEffect, useRef, useState } from "react";
import {
  FiUploadCloud,
  FiFile,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getMyFiles,
  uploadFile,
  deleteFile,
} from "../services/fileApi";

import "./FileManagement.css";

function FileManagement() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".png",
      ".jpg",
      ".jpeg",
    ];

    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isAllowed) {
      setSelectedFile(null);
      setError(
        "Unsupported file type. Allowed files: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setError("File size must not exceed 5 MB.");

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await uploadFile(selectedFile);

      setSuccess("File uploaded successfully.");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadFiles();
    } catch (err) {
      setError(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(fileId);
      setError("");
      setSuccess("");

      await deleteFile(fileId);

      setFiles((currentFiles) =>
        currentFiles.filter((file) => file.id !== fileId)
      );

      setSuccess("File deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete file.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <section className="file-management">
      <div className="file-management-header">
        <div>
          <span className="file-management-label">DOCUMENTS</span>

          <h2>My Files</h2>

          <p>
            Upload and manage your documents from one place.
          </p>
        </div>

        <div className="file-management-count">
          {files.length} {files.length === 1 ? "File" : "Files"}
        </div>
      </div>

      <div className="file-upload-card">
        <div className="upload-icon">
          <FiUploadCloud />
        </div>

        <div className="upload-content">
          <h3>Upload a file</h3>

          <p>
            Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG
          </p>

          <span>Maximum file size: 5 MB</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="file-input"
        />

        <button
          type="button"
          className="choose-file-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose File
        </button>

        {selectedFile && (
          <div className="selected-file">
            <div>
              <FiFile />

              <div>
                <strong>{selectedFile.name}</strong>

                <span>
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="upload-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="file-message error">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="file-message success">
          <FiCheckCircle />
          <span>{success}</span>
        </div>
      )}

      <div className="files-list">
        <div className="files-list-header">
          <h3>Uploaded Files</h3>
        </div>

        {loading ? (
          <div className="files-empty">
            Loading files...
          </div>
        ) : files.length === 0 ? (
          <div className="files-empty">
            <FiFile />

            <h4>No files uploaded yet</h4>

            <p>
              Upload your first document to see it here.
            </p>
          </div>
        ) : (
          <div className="files-grid">
            {files.map((file) => (
              <div className="file-card" key={file.id}>
                <div className="file-card-icon">
                  <FiFile />
                </div>

                <div className="file-card-info">
                  <h4 title={file.original_filename}>
                    {file.original_filename}
                  </h4>

                  <div className="file-meta">
                    <span>
                      {formatFileSize(file.file_size)}
                    </span>

                    <span>•</span>

                    <span>
                      {formatDate(file.created_at)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="delete-file-btn"
                  onClick={() => handleDelete(file.id)}
                  disabled={deletingId === file.id}
                  title="Delete file"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FileManagement;