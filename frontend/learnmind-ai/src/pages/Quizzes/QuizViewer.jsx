import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  ClipboardList,
  Loader2,
  Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";
import quizService from "../../services/quizService";

const QuizViewer = ({ quiz, onClose, onSubmitted }) => {
  const questions = quiz.questions || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);

  const question = questions[currentQuestion];

  if (!question) return null;

  const handleSelectOption = (option) => {
    setSelectedOption(option);

    const updated = [...answers];
    const idx = updated.findIndex(
      (a) => a.questionIndex === currentQuestion
    );

    if (idx >= 0) {
      updated[idx] = {
        questionIndex: currentQuestion,
        selectedAnswer: option,
      };
    } else {
      updated.push({
        questionIndex: currentQuestion,
        selectedAnswer: option,
      });
    }

    setAnswers(updated);
  };

  const gotoQuestion = (i) => {
    setCurrentQuestion(i);

    const prev = answers.find(
      (a) => a.questionIndex === i
    );

    setSelectedOption(prev?.selectedAnswer || null);
  };

  const handleSubmit = async () => {
    if (answers.length !== questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    try {
      setLoading(true);
      await quizService.submitQuiz(quiz._id, answers);
      toast.success("Quiz submitted successfully!");
      onSubmitted();
    } catch (e) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="mx-auto flex h-[88vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Sidebar */}
        <aside className="hidden w-72 border-r border-slate-100 bg-gradient-to-b from-slate-50/60 to-slate-50/10 p-6 dark:border-slate-800 dark:from-slate-950/40 dark:to-slate-950/10 lg:flex lg:flex-col">
          <div className="flex items-center gap-2.5 text-base font-bold text-slate-800 dark:text-slate-100">
            <ClipboardList className="h-5 w-5 text-emerald-500" />
            <span>Navigation Panel</span>
          </div>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Track and jump between questions</p>

          <div className="mt-6 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-4 gap-2.5">
              {questions.map((_, i) => {
                const done = answers.some((a) => a.questionIndex === i);
                const isCurrent = currentQuestion === i;

                return (
                  <button
                    key={i}
                    onClick={() => gotoQuestion(i)}
                    className={`h-11 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-95 ${
                      isCurrent
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                        : done
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Interface Content */}
        <div className="flex flex-1 flex-col bg-white dark:bg-slate-900">

          {/* Header */}
          <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50/40 to-white p-6 dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {quiz.title}
                </h2>
                <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Question <span className="font-semibold text-slate-700 dark:text-slate-300">{currentQuestion + 1}</span> of <span className="font-medium">{questions.length}</span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl border border-slate-100 p-2 text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-600 active:scale-95 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress Bar Container */}
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-amber-500" /> Assessment Completion</span>
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded dark:bg-slate-800 text-slate-600 dark:text-slate-400">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Presentation Deck */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-slate-50/10 p-6 dark:from-slate-950/30 dark:to-slate-950/10 sm:p-8">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                Active Assessment Task
              </span>

              <h3 className="mt-4 text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                {question.question}
              </h3>

              {/* Options Mapping */}
              <div className="mt-6 space-y-3">
                {question.options.map((option, i) => {
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(option)}
                      className={`flex w-full items-center justify-between rounded-xl border p-4.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.99] ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/50 text-slate-900 dark:bg-emerald-950/20 dark:text-emerald-300 shadow-sm"
                          : "border-slate-200/80 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="pr-4">{option}</span>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Control Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <button
              disabled={currentQuestion === 0}
              onClick={() => gotoQuestion(currentQuestion - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-97 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:brightness-105 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {loading ? "Submitting..." : "Submit Quiz"}
              </button>
            ) : (
              <button
                onClick={() => gotoQuestion(currentQuestion + 1)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/10 transition-all hover:brightness-105 active:scale-97"
              >
                Next Question
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizViewer;