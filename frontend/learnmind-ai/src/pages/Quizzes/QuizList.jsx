import React, { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import quizService from "../../services/quizService";

import QuizCard from "./QuizCard";
import QuizViewer from "./QuizViewer";
import GenerateQuizModal from "./GenerateQuizModal";
import QuizResult from "./QuizResult";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

const QuizList = ({ documentId }) => {
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      const response =
        await quizService.getQuizzesForDocument(documentId);

      setQuizSets(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Failed to load quizzes."
      );

      setQuizSets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerate = async (
    questionCount,
    difficulty
  ) => {
    try {
      await quizService.generateQuiz(
        documentId,
        questionCount,
        difficulty
      );

      toast.success("Quiz generated successfully.");

      setShowGenerateModal(false);

      fetchQuizzes();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Failed to generate quiz."
      );
    }
  };

  const handleOpenQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowViewer(true);
  };

  const handleCloseQuiz = () => {
    setSelectedQuiz(null);
    setShowViewer(false);
  };

  const handleViewResults = async (quizId) => {
    try {
      const response =
        await quizService.getQuizResults(quizId);

      setResultData(response.data);
      setShowResult(true);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Unable to load results."
      );
    }
  };

  const handleCloseResults = () => {
    setShowResult(false);
    setResultData(null);
  };

  const openDeleteModal = (quizId) => {
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
  };

  const handleDeleteQuiz = async () => {
    try {
      setDeleting(true);

      await quizService.deleteQuiz(quizToDelete);

      toast.success("Quiz deleted successfully.");

      setShowDeleteModal(false);
      setQuizToDelete(null);

      await fetchQuizzes();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.message || "Failed to delete quiz."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Your Quiz Sets
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {quizSets.length} Quiz Set
              {quizSets.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus size={20} />
            Generate Quiz
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          </div>
        ) : quizSets.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
              No Quiz Sets Available
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Generate your first AI quiz from this document.
            </p>

            <button
              onClick={() => setShowGenerateModal(true)}
              className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              Generate Quiz
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {quizSets.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                onOpen={handleOpenQuiz}
                onViewResults={handleViewResults}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      <GenerateQuizModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerate}
      />

      {showViewer && selectedQuiz && (
        <QuizViewer
          quiz={selectedQuiz}
          onClose={handleCloseQuiz}
          onSubmitted={() => {
            handleCloseQuiz();
            fetchQuizzes();
          }}
        />
      )}

      {showResult && resultData && (
        <QuizResult
          result={resultData}
          onClose={handleCloseResults}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Quiz"
        message="Are you sure you want to permanently delete this quiz? This action cannot be undone."
        loading={deleting}
        onCancel={() => {
          setShowDeleteModal(false);
          setQuizToDelete(null);
        }}
        onConfirm={handleDeleteQuiz}
      />
    </>
  );
};

export default QuizList;