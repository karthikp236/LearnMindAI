import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// -----------------------------------------
// Get Flashcards
// -----------------------------------------

const getFlashcards = async (documentId) => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId)
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch flashcards",
      }
    );
  }
};

// -----------------------------------------
// Generate Flashcards
// -----------------------------------------

const generateFlashcards = async (documentId, count = 10) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_FLASHCARDS,
      {
        documentId,
        count,
      }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to generate flashcards",
      }
    );
  }
};

// -----------------------------------------
// Review Flashcard
// -----------------------------------------

const reviewFlashcard = async (cardId) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId)
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to review flashcard",
      }
    );
  }
};

// -----------------------------------------
// Toggle Star
// -----------------------------------------

const toggleStarFlashcard = async (cardId) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId)
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to update flashcard",
      }
    );
  }
};

// -----------------------------------------
// Delete Flashcard Set
// -----------------------------------------

const deleteFlashcardSet = async (id) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id)
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to delete flashcard set",
      }
    );
  }
};
// -----------------------------------------
// Get All Flashcard Sets
// -----------------------------------------
const getAllFlashcardSets = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS
    );

    return response.data;
  } catch (error) {
    console.error("Get All Flashcards Error:", error);

    throw (
      error.response?.data || {
        message: "Failed to fetch flashcard sets",
      }
    );
  }
};
export default {
  getFlashcards,
  getAllFlashcardSets,
  generateFlashcards,
  reviewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSet,
};