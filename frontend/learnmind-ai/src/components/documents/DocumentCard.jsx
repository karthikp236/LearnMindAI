import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  BookOpen,
  BrainCircuit,
  Clock,
} from "lucide-react";
import moment from "moment";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500"
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
            <FileText
              className="h-6 w-6 text-white"
              strokeWidth={2}
            />
          </div>

          <button
            onClick={handleDelete}
            className="opacity-0 transition group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <h3
          className="break-words text-xl font-semibold text-slate-900 dark:text-white"
          title={document.title}
        >
          {document.title}
        </h3>

        {/* Size */}
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {formatFileSize(document.fileSize)}
        </p>

        {/* Stats */}
        <div className="mt-5 flex gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-1 dark:bg-purple-900/20">
            <BookOpen
              className="h-3.5 w-3.5 text-purple-600 dark:text-purple-300"
              strokeWidth={2}
            />
            <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300">
              {document.flashcardCount} Flashcards
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20">
            <BrainCircuit
              className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300"
              strokeWidth={2}
            />
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              {document.quizCount} Quizzes
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <Clock
            className="h-3.5 w-3.5"
            strokeWidth={2}
          />
          <span>
            Uploaded {moment(document.createdAt).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;