import React from "react";
import {
  BookOpen,
  Calendar,
  Trash2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const AllFlashcardCard = ({
  flashcardSet,
  onOpen,
  onDelete,
}) => {
  const totalCards = flashcardSet.cards?.length || 0;
  const reviewedCards = flashcardSet.reviewedCards || 0;
  const progress = flashcardSet.progress || 0;

  const createdDate = new Date(
    flashcardSet.createdAt
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      onClick={() => onOpen(flashcardSet)}
      className="group flex w-full cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500"
    >
      {/* Header */}
      <div className="flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <BookOpen
            size={28}
            className="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h2 className="flex-1 break-words text-2xl font-semibold leading-8 text-slate-900 dark:text-white">
              {flashcardSet.title || "Flashcard Set"}
            </h2>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(flashcardSet._id);
              }}
              className="flex-shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Calendar
              size={14}
              className="text-slate-400 dark:text-slate-500"
            />

            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              CREATED {createdDate}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-slate-200 dark:bg-slate-700" />

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-700 dark:bg-emerald-900/20">
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {totalCards} Cards
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-800">
          <TrendingUp
            size={15}
            className="text-emerald-600 dark:text-emerald-400"
          />

          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {progress}%
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Progress
          </span>

          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {reviewedCards}/{totalCards} reviewed
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpen(flashcardSet);
        }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-medium text-white transition hover:bg-emerald-700"
      >
        <Sparkles size={18} />
        Study Now
      </button>
    </div>
  );
};

export default AllFlashcardCard;