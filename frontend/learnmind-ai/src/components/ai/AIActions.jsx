import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Sparkles,
  FileText,
  Loader2,
  Trash2,
  Lightbulb,
} from "lucide-react";

import aiService from "../../services/aiService";
import DeleteConfirmModal from "../common/DeleteConfirmModal";

const AIActions = ({ documentId }) => {
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [concept, setConcept] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);

  const [explanation, setExplanation] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState("");

  const handleGenerateSummary = async () => {
    try {
      setLoadingSummary(true);

      const response = await aiService.generateSummary(documentId);

      const generatedSummary =
        response?.data?.summary ||
        response?.summary ||
        "";

      setSummary(generatedSummary);

      toast.success("Summary generated successfully!");
    } catch (error) {
      console.error(error);

      toast.error("Failed to generate summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleExplainConcept = async () => {
    if (!concept.trim()) {
      toast.error("Please enter a concept.");
      return;
    }

    try {
      setLoadingExplain(true);

      const response =
        await aiService.explainConcept(
          documentId,
          concept
        );

      const result =
        response?.data?.explanation ||
        response?.data?.answer ||
        response?.explanation ||
        "";

      setExplanation(result);

      toast.success(
        "Concept explained successfully!"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to explain concept."
      );
    } finally {
      setLoadingExplain(false);
    }
  };

  const openDeleteModal = (type) => {
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (deleteType === "summary") {
      setSummary("");
    }

    if (deleteType === "explanation") {
      setExplanation("");
      setConcept("");
    }

    toast.success(
      deleteType === "summary"
        ? "Summary cleared successfully!"
        : "Explanation cleared successfully!"
    );

    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-8">

      {/* AI Summary */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/30">

            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />

          </div>

          <div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              AI Summary
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Generate a concise summary of your document.
            </p>

          </div>

        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={loadingSummary}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {loadingSummary ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Summary
            </>
          )}
        </button>
                {summary && (

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">

            <div className="mb-4 flex items-center justify-between">

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Summary
              </h3>

              <button
                onClick={() => openDeleteModal("summary")}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                <Trash2 size={18} />
              </button>

            </div>

            <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-300">
              {summary}
            </p>

          </div>

        )}

      </div>

      {/* Explain Concept */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">

            <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />

          </div>

          <div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Explain Concept
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter any topic from this document to get an AI explanation.
            </p>

          </div>

        </div>

        <div className="mt-6 flex gap-3">

          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Enter a concept..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />

          <button
            onClick={handleExplainConcept}
            disabled={loadingExplain}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loadingExplain ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Explaining...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Explain
              </>
            )}
          </button>

        </div>

        {explanation && (

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">

            <div className="mb-4 flex items-center justify-between">

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Explanation
              </h3>

              <button
                onClick={() => openDeleteModal("explanation")}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                <Trash2 size={18} />
              </button>

            </div>

            <p className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-300">
              {explanation}
            </p>

          </div>

        )}
              </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title={
          deleteType === "summary"
            ? "Clear Summary"
            : "Clear Explanation"
        }
        message={
          deleteType === "summary"
            ? "Are you sure you want to clear this summary? This action cannot be undone."
            : "Are you sure you want to clear this explanation? This action cannot be undone."
        }
        confirmText="Clear"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default AIActions;