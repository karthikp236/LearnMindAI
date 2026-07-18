import React from "react";
import { Trash2 } from "lucide-react";

const DeleteConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmText = "Delete",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-10 w-10 text-red-600" />
        </div>

        {/* Title */}
        <h2 className="mt-5 text-center text-3xl font-bold text-slate-900">
          {title}
        </h2>

        {/* Message */}
        <p className="mt-4 text-center text-base leading-7 text-slate-500">
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-7 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-7 py-3 font-medium text-white transition hover:bg-red-700"
          >
            {loading ? `${confirmText}...` : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmModal;