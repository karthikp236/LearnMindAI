import React, { useState } from "react";
import { CalendarDays, FileQuestion, Trash2 } from "lucide-react";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

const QuizCard = ({
  quiz,
  onOpen,
  onViewResults,
  onDelete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const totalQuestions =
    quiz.totalQuestions ||
    quiz.questions?.length ||
    0;

  const createdDate = new Date(
    quiz.createdAt
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const confirmDelete = async () => {
    await onDelete(quiz._id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500">

        {/* Header */}
        <div className="flex items-start justify-between">

          <div className="rounded-2xl bg-emerald-100 p-4 dark:bg-emerald-900/30">
            <FileQuestion className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>

        </div>

        {/* Title */}
        <h2 className="mt-6 break-words text-xl font-semibold text-slate-900 dark:text-white">
          {quiz.title || "AI Quiz"}
        </h2>

        {/* Date */}
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-4 w-4" />
          Created {createdDate}
        </div>

        {/* Stats */}
        <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Score
            </span>

            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {quiz.completedAt
                ? `${quiz.score}%`
                : "Not Attempted"}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Questions
            </span>

            <span className="font-semibold text-slate-900 dark:text-white">
              {totalQuestions}
            </span>
          </div>

        </div>

        {/* Action */}
        <button
          onClick={() =>
            quiz.completedAt
              ? onViewResults(quiz._id)
              : onOpen(quiz)
          }
          className="mt-8 w-full rounded-xl bg-emerald-600 py-3 font-medium text-white transition hover:bg-emerald-700"
        >
          {quiz.completedAt
            ? "View Results"
            : "Start Quiz"}
        </button>

      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Quiz"
        message="Are you sure you want to permanently delete this quiz? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default QuizCard;