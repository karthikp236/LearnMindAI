import React, { useState } from "react";
import { X, Brain, Loader2 } from "lucide-react";

const GenerateQuizModal = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);

      await onGenerate(questionCount, difficulty);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-700">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/30">
              <Brain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Generate Quiz
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Create an AI quiz from this document.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X
              size={20}
              className="text-slate-700 dark:text-slate-300"
            />
          </button>

        </div>

        {/* Question Count */}
        <div className="mb-6">

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Number of Questions
          </label>

          <select
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(Number(e.target.value))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
            <option value={20}>20 Questions</option>
          </select>

        </div>

        {/* Difficulty */}
        <div className="mb-8">

          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-3 transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                Generate
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
};

export default GenerateQuizModal;