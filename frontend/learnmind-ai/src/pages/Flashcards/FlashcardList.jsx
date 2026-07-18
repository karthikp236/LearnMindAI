import React, { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import FlashcardCard from "./FlashcardCard";
import FlashcardViewer from "./FlashcardViewer";
import GenerateFlashcardModal from "./GenerateFlashcardModal";
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal";

import flashcardService from "../../services/flashcardService";

const FlashcardList = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [selectedSet, setSelectedSet] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  // Delete states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // -----------------------------------------
  // Fetch Flashcards
  // -----------------------------------------

  const fetchFlashcards = async () => {
    try {
      setLoading(true);

      const response = await flashcardService.getFlashcards(
        documentId
      );

      if (response.success) {
        setFlashcardSets(response.data);
      } else {
        setFlashcardSets([]);
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to load flashcards.");

      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcards();
    }
  }, [documentId]);

  // -----------------------------------------
  // Generate Flashcards
  // -----------------------------------------

  const handleGenerate = async (count = 10) => {
    try {
      setLoading(true);

      await flashcardService.generateFlashcards(
        documentId,
        count
      );

      toast.success("Flashcards generated successfully!");

      setShowGenerateModal(false);

      await fetchFlashcards();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || "Failed to generate flashcards."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Open Viewer
  // -----------------------------------------

  const handleOpenSet = (set) => {
    setSelectedSet(set);
    setShowViewer(true);
  };

  // -----------------------------------------
  // Close Viewer
  // -----------------------------------------

  const handleCloseViewer = () => {
    setSelectedSet(null);
    setShowViewer(false);
  };

  // -----------------------------------------
  // Delete Flashcard
  // -----------------------------------------

  const openDeleteModal = (id) => {
    setFlashcardToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteFlashcard = async () => {
    try {
      setDeleting(true);

      await flashcardService.deleteFlashcardSet(
        flashcardToDelete
      );

      toast.success("Flashcard set deleted successfully.");

      setShowDeleteModal(false);
      setFlashcardToDelete(null);

      await fetchFlashcards();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || "Failed to delete flashcard set."
      );
    } finally {
      setDeleting(false);
    }
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <>
      <div className="space-y-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Your Flashcard Sets
            </h1>

            <p className="mt-2 text-slate-500">
              {flashcardSets.length} set
              {flashcardSets.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white shadow-md transition hover:bg-emerald-700"
          >
            <Plus size={20} />
            Generate New Set
          </button>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />

            <p className="mt-5 text-slate-500">
              Loading flashcards...
            </p>
          </div>
        )}

        {/* Empty State */}

        {!loading && flashcardSets.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <h2 className="text-2xl font-semibold text-slate-700">
              No Flashcard Sets
            </h2>

            <p className="mt-3 text-slate-500">
              Generate your first flashcard set using AI.
            </p>

            <button
              onClick={() => setShowGenerateModal(true)}
              className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
            >
              Generate Flashcards
            </button>
          </div>
        )}

        {/* Flashcard Grid */}

        {!loading && flashcardSets.length > 0 && (
<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {flashcardSets.map((set) => (
              <FlashcardCard
                key={set._id}
                flashcardSet={set}
                onOpen={handleOpenSet}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Generate Modal */}

      <GenerateFlashcardModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerate}
      />

      {/* Delete Modal */}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Flashcard Set"
        message="Are you sure you want to permanently delete this flashcard set? This action cannot be undone."
        loading={deleting}
        onCancel={() => {
          setShowDeleteModal(false);
          setFlashcardToDelete(null);
        }}
        onConfirm={handleDeleteFlashcard}
      />

      {/* Flashcard Viewer */}

      {showViewer && selectedSet && (
        <FlashcardViewer
          flashcardSet={selectedSet}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
};

export default FlashcardList;