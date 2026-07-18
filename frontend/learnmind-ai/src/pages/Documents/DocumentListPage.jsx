import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  FileText,
  Upload,
  X,
  Trash2,
} from "lucide-react";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // -------------------------
  // Fetch Documents
  // -------------------------

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const data = await documentService.getDocuments();

      setDocuments(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // -------------------------
  // Upload
  // -------------------------

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploadFile(file);

    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadTitle.trim()) {
      toast.error("Please enter document title.");
      return;
    }

    if (!uploadFile) {
      toast.error("Please select a PDF.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", uploadTitle);
      formData.append("file", uploadFile);

      await documentService.uploadDocument(formData);

      toast.success("Document uploaded successfully!");

      setUploadTitle("");
      setUploadFile(null);

      setIsUploadModalOpen(false);

      fetchDocuments();
    } catch (error) {
      toast.error(error?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // -------------------------
  // Delete
  // -------------------------

  const handleDeleteRequest = (document) => {
    setSelectedDoc(document);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;

    try {
      setDeleting(true);

      await documentService.deleteDocument(selectedDoc._id);

      toast.success("Document deleted.");

      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== selectedDoc._id)
      );

      setSelectedDoc(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  // -------------------------
  // Loading
  // -------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spinner />
      </div>
    );
  }

  // -------------------------
  // Documents Grid
  // -------------------------

  const renderContent = () => {
    if (documents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[420px] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-6">

            <FileText
              className="w-10 h-10 text-emerald-600"
              strokeWidth={2}
            />

          </div>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            No Documents Yet
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center max-w-sm">
            Upload your first PDF document to generate summaries,
            flashcards and quizzes.
          </p>

          <Button
            className="mt-8"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </Button>

        </div>
      );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {documents.map((document) => (
          <DocumentCard
            key={document._id}
            document={document}
            onDelete={handleDeleteRequest}
          />
        ))}

      </div>
    );
  };
    return (
    <div className="min-h-screen relative">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:24px_24px] opacity-50 pointer-events-none dark:bg-[radial-gradient(#334155_1px,transparent_1px)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              My Documents
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Manage and organize your learning materials
            </p>
          </div>

          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}

        </div>

        {/* Documents */}
        {renderContent()}

        {/* ================= Upload Modal ================= */}

        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">

            <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-8">

              {/* Close */}
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
              >
                <X
                  className="w-5 h-5 text-slate-500 dark:text-slate-400 dark:text-slate-500"
                  strokeWidth={2}
                />
              </button>

              {/* Heading */}
              <div className="mb-8">

                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Upload New Document
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  Add a PDF document to your learning library.
                </p>

              </div>

              <form
                onSubmit={handleUpload}
                className="space-y-6"
              >

                {/* Title */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Document Title
                  </label>

                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) =>
                      setUploadTitle(e.target.value)
                    }
                    placeholder="e.g., React Interview Notes"
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 outline-none transition focus:border-emerald-500 focus:bg-white dark:bg-slate-900"
                    required
                  />

                </div>

                {/* Upload Area */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    PDF File
                  </label>

                  <div className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:border-emerald-400 transition">

                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />

                    <div className="flex flex-col items-center justify-center py-12 px-6">

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100">

                        <Upload
                          className="w-8 h-8 text-emerald-600"
                          strokeWidth={2}
                        />

                      </div>

                      <p className="mt-5 text-sm text-center">

                        {uploadFile ? (

                          <span className="font-medium text-emerald-600">
                            {uploadFile.name}
                          </span>

                        ) : (

                          <>
                            <span className="font-semibold text-emerald-600">
                              Click to upload
                            </span>

                            <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">
                              {" "}or drag and drop
                            </span>
                          </>

                        )}

                      </p>

                      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        PDF up to 10 MB
                      </p>

                    </div>

                  </div>

                </div>

                {/* Buttons */}

                <div className="flex gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    disabled={uploading}
                    className="flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 py-3 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-medium text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl transition"
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      "Upload"
                    )}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}
                {/* ================= Delete Confirmation Modal ================= */}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">

            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-8">

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedDoc(null);
                }}
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
              >
                <X
                  className="w-5 h-5 text-slate-500 dark:text-slate-400 dark:text-slate-500"
                  strokeWidth={2}
                />
              </button>

              {/* Icon */}
              <div className="mb-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-red-100 to-red-200">

                  <Trash2
                    className="w-7 h-7 text-red-600"
                    strokeWidth={2}
                  />

                </div>

              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Confirm Deletion
              </h2>

              {/* Description */}
              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400 dark:text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedDoc?.title}
                </span>
                ? This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex gap-3">

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedDoc(null);
                  }}
                  className="flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 py-3 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800 transition disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-medium text-white shadow-lg shadow-red-500/20 hover:shadow-xl transition disabled:opacity-60"
                >
                  {deleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DocumentListPage;