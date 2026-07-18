import React, { useEffect, useState } from "react";
import { Loader2, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";

import FlashcardCard from "./FlashcardCard";
import FlashcardViewer from "./FlashcardViewer";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

import flashcardService from "../../services/flashcardService";

const AllFlashcards = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSet, setSelectedSet] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);

      const response = await flashcardService.getAllFlashcardSets();

      if (response.success) {
        setFlashcardSets(response.data || []);
      } else {
        setFlashcardSets([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to load flashcards.");
      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleOpenSet = (set) => {
    setSelectedSet(set);
    setShowViewer(true);
  };

  const handleDelete = (id) => {
    setFlashcardToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      await flashcardService.deleteFlashcardSet(flashcardToDelete);

      toast.success("Flashcard deleted successfully");

      setShowDeleteModal(false);
      setFlashcardToDelete(null);

      fetchFlashcards();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete flashcard.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">

        {/* Header */}

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              All Flashcard Sets
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {flashcardSets.length} set
              {flashcardSets.length !== 1 ? "s" : ""} available
            </p>
          </div>

        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          </div>
        ) : flashcardSets.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-24 text-center dark:border-slate-700 dark:bg-slate-900">
            <BookOpen className="mx-auto mb-6 h-14 w-14 text-slate-400" />

            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              No Flashcards Yet
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Generate flashcards from a document to start studying.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2">

            {flashcardSets.map((set) => (
              <div
                key={set._id}
                className="w-full max-w-md"
              >
                <FlashcardCard
                  flashcardSet={set}
                  showProgress
                  showStudyButton
                  onOpen={handleOpenSet}
                  onDelete={handleDelete}
                />
              </div>
            ))}

          </div>
        )}
      </div>

      {showViewer && selectedSet && (
        <FlashcardViewer
          flashcardSet={selectedSet}
          onClose={() => {
            setSelectedSet(null);
            setShowViewer(false);
          }}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Flashcard Set"
        message="Are you sure you want to delete this flashcard set?"
        confirmText="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setFlashcardToDelete(null);
        }}
      />
    </>
  );
};

export default AllFlashcards;