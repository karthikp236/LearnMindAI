import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from "lucide-react";
import flashcardService from "../../services/flashcardService";

const FlashcardViewer = ({ flashcardSet, onClose }) => {
  const cards = flashcardSet?.cards || [];

  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const card = cards[current];

  const progress =
    cards.length === 0
      ? 0
      : Math.round(((current + 1) / cards.length) * 100);

  const nextCard = useCallback(async () => {
    try {
      if (card?._id) {
        await flashcardService.reviewFlashcard(card._id);
      }
    } catch (err) {
      console.error(err);
    }

    if (current === cards.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrent((prev) => prev + 1);
    setFlipped(false);
  }, [card?._id, current, cards.length]);

  const previousCard = useCallback(() => {
    if (current === 0) return;

    setCurrent((prev) => prev - 1);
    setFlipped(false);
  }, [current]);

  const restart = useCallback(() => {
    setCurrent(0);
    setCompleted(false);
    setFlipped(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowRight":
          nextCard();
          break;

        case "ArrowLeft":
          previousCard();
          break;

        case " ":
          e.preventDefault();
          setFlipped((prev) => !prev);
          break;

        case "Escape":
          onClose();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [nextCard, previousCard, onClose]);

  if (completed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md transition-all duration-300">
        <div className="w-full max-w-sm transform rounded-3xl bg-white p-8 text-center shadow-2xl border border-slate-100 transition-all dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/50">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Session Completed 🎉
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Fantastic work! You have successfully studied all flashcards in this set.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={restart}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-98 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
              Study Again
            </button>

            <button
              onClick={onClose}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:brightness-105 active:scale-98"
            >
              Close Overlay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header Section */}
        <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white px-8 pt-6 pb-4 dark:border-slate-800 dark:from-slate-900/50 dark:to-slate-900">
          <div className="mb-2.5 flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-amber-500" /> Study Progress</span>
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded dark:bg-slate-800 text-slate-600 dark:text-slate-300">{progress}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 mb-5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {flashcardSet.title || "Flashcards"}
              </h2>
              <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                Card <span className="text-slate-700 dark:text-slate-300 font-semibold">{current + 1}</span> of <span className="font-medium">{cards.length}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-100 p-2 text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-600 active:scale-95 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card Display Area */}
        <div className="bg-gradient-to-b from-slate-50/60 to-slate-50/30 px-6 py-10 dark:from-slate-950/40 dark:to-slate-950/20">
          <div
            onClick={() => setFlipped(!flipped)}
            className="mx-auto w-full max-w-2xl cursor-pointer"
            style={{
              perspective: "1400px",
              height: "260px", 
            }}
          >
            <div
              className="relative h-full w-full transition-transform duration-500 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* FRONT (Question) */}
              <div
                className="absolute inset-0 flex flex-col rounded-2xl border border-slate-200/70 bg-white p-6 shadow-md transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="flex justify-center">
                  <span className="flex items-center gap-1.5 rounded-full bg-indigo-50/70 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <HelpCircle className="h-3 w-3" /> Question
                  </span>
                </div>

                <div className="mt-4 flex flex-1 items-center justify-center overflow-y-auto px-4">
                  <h2 className="w-full break-words text-center text-base font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                    {card?.question}
                  </h2>
                </div>

                <div className="mt-4 text-center text-[11px] font-medium text-slate-400 tracking-wide">
                  Click card or press <kbd className="bg-slate-100 text-slate-600 shadow-sm border border-slate-200/60 px-1.5 py-0.5 rounded font-sans font-bold dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">Space</kbd> to flip
                </div>
              </div>

              {/* BACK (Answer) */}
              <div
                className="absolute inset-0 flex flex-col rounded-2xl border border-emerald-200/60 bg-gradient-to-b from-emerald-50/10 to-white p-6 shadow-md transition-all hover:shadow-lg dark:border-emerald-900/30 dark:from-slate-900 dark:to-slate-900"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex justify-center">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Answer
                  </span>
                </div>

                <div className="mt-4 flex flex-1 items-center justify-center overflow-y-auto px-4">
                  <h2 className="w-full break-words font-mono text-center text-[15px] font-medium leading-relaxed tracking-normal text-slate-800 dark:text-slate-200 bg-slate-50/60 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    {card?.answer}
                  </h2>
                </div>

                <div className="mt-4 text-center text-[11px] font-medium text-slate-400 tracking-wide">
                  Press <kbd className="bg-slate-100 text-slate-600 shadow-sm border border-slate-200/60 px-1.5 py-0.5 rounded font-sans font-bold dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">→</kbd> to go to the next card
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions and Navigation */}
        <div className="border-t border-slate-100 bg-white px-8 py-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <button
              onClick={previousCard}
              disabled={current === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-97 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              onClick={() => setFlipped(!flipped)}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-indigo-500/10 transition-all hover:shadow-lg hover:brightness-105 active:scale-97"
            >
              {flipped ? "Show Question" : "Show Answer"}
            </button>

            <button
              onClick={nextCard}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/10 transition-all hover:shadow-lg hover:brightness-105 active:scale-97"
            >
              {current === cards.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Inline Keyboard Controls Legend */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-[11px] font-medium text-slate-400 dark:border-slate-800/60 dark:text-slate-500">
            <button
              onClick={restart}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-700 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>

            <span className="hidden sm:inline h-3 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center gap-1">
              <span className="text-slate-400/80">Next Card</span>
              <kbd className="rounded border border-slate-200/70 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold shadow-sm font-sans dark:bg-slate-800 dark:border-slate-700">➔</kbd>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-slate-400/80">Prev Card</span>
              <kbd className="rounded border border-slate-200/70 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold shadow-sm font-sans dark:bg-slate-800 dark:border-slate-700">➔</kbd>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-400/80">Flip</span>
              <kbd className="rounded border border-slate-200/70 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold shadow-sm font-sans dark:bg-slate-800 dark:border-slate-700">Space</kbd>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-400/80">Close</span>
              <kbd className="rounded border border-slate-200/70 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold shadow-sm font-sans dark:bg-slate-800 dark:border-slate-700">Esc</kbd>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FlashcardViewer;