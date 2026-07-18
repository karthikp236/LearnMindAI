import React from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  CircleHelp,
  Sparkles
} from "lucide-react";

const QuizResult = ({ result, onClose }) => {
  if (!result) return null;

  const quiz = result.quiz;
  const questions = result.results || [];

  const correctAnswers = questions.filter((q) => q.isCorrect).length;
  const wrongAnswers = questions.length - correctAnswers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="mx-auto flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Sticky Professional Header Area */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-gradient-to-b from-slate-50/40 to-white p-6 dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm dark:bg-emerald-950/50">
                <Trophy className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Performance Assessment Analytics
                </h2>
                <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  {quiz.title}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-100 p-2 text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-600 active:scale-95 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Premium High-End Summary Statistics Dashboard */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4.5 text-center dark:border-emerald-900/30 dark:bg-emerald-950/10">
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-2 text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase">
                Final Grade Score
              </p>
              <p className="mt-1 font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {quiz.score}%
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4.5 text-center dark:border-indigo-900/30 dark:bg-indigo-950/10">
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="mt-2 text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase">
                Correct Breakdown
              </p>
              <p className="mt-1 font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {correctAnswers} <span className="text-sm font-medium text-slate-400">/ {questions.length}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4.5 text-center dark:border-rose-900/30 dark:bg-rose-950/10">
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/40">
                <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
              <p className="mt-2 text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500 uppercase">
                Incorrect Flagged
              </p>
              <p className="mt-1 font-mono text-3xl font-black text-rose-600 dark:text-rose-400">
                {wrongAnswers} <span className="text-sm font-medium text-slate-400">items</span>
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Breakdown List */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-550/40 bg-gradient-to-b from-slate-50/60 to-slate-50/10 p-6 dark:from-slate-950/30 dark:to-slate-950/10">
          {questions.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    Question {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-2.5 text-base font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                    {item.question}
                  </h3>
                </div>

                {item.isCorrect ? (
                  <span className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-xl bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                    <XCircle className="h-3.5 w-3.5" /> Missed
                  </span>
                )}
              </div>

              {/* Grid System Options */}
              <div className="space-y-2">
                {item.options.map((option, i) => {
                  const isCorrectAnswer = option === item.correctAnswer;
                  const isSelectedAnswer = option === item.selectedAnswer;

                  return (
                    <div
                      key={i}
                      className={`rounded-xl border p-3.5 text-xs font-medium transition-all ${
                        isCorrectAnswer
                          ? "border-green-300 bg-green-50/40 dark:border-green-900/40 dark:bg-green-950/10"
                          : isSelectedAnswer
                          ? "border-rose-300 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/10"
                          : "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-slate-700 dark:text-slate-300 ${isCorrectAnswer ? "font-semibold text-green-900 dark:text-green-300" : ""}`}>
                          {option}
                        </span>

                        {isCorrectAnswer && (
                          <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/60 dark:text-green-300">
                            Valid Option
                          </span>
                        )}

                        {!isCorrectAnswer && isSelectedAnswer && (
                          <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                            Your Choice
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Academic Style Explanation Block */}
              {item.explanation && (
                <div className="mt-5 rounded-xl border-l-4 border-indigo-500 bg-indigo-50/40 p-4.5 dark:bg-indigo-950/10">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <CircleHelp className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                      Solution Context
                    </h4>
                  </div>
                  <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.explanation}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;