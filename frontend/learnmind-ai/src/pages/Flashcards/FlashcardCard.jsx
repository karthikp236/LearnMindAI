import React from "react";
import {
  BookOpen,
  Calendar,
  Trash2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const FlashcardCard = ({
  flashcardSet,
  onOpen,
  onDelete,
  showProgress = false,
  showStudyButton = false,
}) => {
  const totalCards = flashcardSet.cards?.length || 0;
  const reviewedCards = flashcardSet.reviewedCards || 0;
  const progress = flashcardSet.progress || 0;

  const createdDate = new Date(flashcardSet.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div
      onClick={() => onOpen?.(flashcardSet)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
    >
      {/* Top Gradient */}
      <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 transition group-hover:scale-110 dark:bg-emerald-900/40">
            <BookOpen className="text-emerald-600" size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="line-clamp-2 text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                {flashcardSet.title || "Flashcard Set"}
              </h2>

              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(flashcardSet._id);
                  }}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar size={14} />
              <span>{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-900/20">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cards
            </p>
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              {totalCards}
            </p>
          </div>

          {showProgress && (
            <div className="rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
              <div className="flex items-center gap-1">
                <TrendingUp
                  size={14}
                  className="text-blue-600 dark:text-blue-400"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Progress
                </p>
              </div>

              <p className="font-semibold text-blue-700 dark:text-blue-400">
                {progress}%
              </p>
            </div>
          )}
        </div>

        {/* Progress */}
        {showProgress && (
          <>
            <div className="mt-5 flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Reviewed
              </span>

              <span className="font-medium text-slate-700 dark:text-slate-300">
                {reviewedCards}/{totalCards}
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </>
        )}

        {/* Study Button */}
        {showStudyButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.(flashcardSet);
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-sm font-semibold text-white shadow transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <Sparkles size={17} />
            Study Now
          </button>
        )}
      </div>
    </div>
  );
};

export default FlashcardCard;