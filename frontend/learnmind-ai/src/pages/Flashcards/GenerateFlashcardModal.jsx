import React, { useState } from "react";
import { X, Brain, Loader2 } from "lucide-react";

const GenerateFlashcardModal = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);

      await onGenerate(count);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        {/* Header */}

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-100 p-3">
              <Brain className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Generate Flashcards
              </h2>

              <p className="text-sm text-slate-500">
                AI will generate study cards from your document.
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Number of Cards */}

        <label className="mb-2 block text-sm font-medium">
          Number of Flashcards
        </label>

        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="mb-8 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
        >
          <option value={5}>5 Cards</option>
          <option value={10}>10 Cards</option>
          <option value={15}>15 Cards</option>
          <option value={20}>20 Cards</option>
        </select>

        {/* Buttons */}

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-3 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
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

export default GenerateFlashcardModal;