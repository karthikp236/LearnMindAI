import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";

// @desc    Get user learning statistics
// @route   GET /api/progress/dashboard
// @access  Private
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Counts
    const totalDocuments = await Document.countDocuments({ userId });
    const totalFlashcardSets = await Flashcard.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });
    const completedQuizzes = await Quiz.countDocuments({
      userId,
      completedAt: { $ne: null },
    });

    // Flashcard statistics
    const flashcardSets = await Flashcard.find({ userId });

    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach((set) => {
      totalFlashcards += set.cards.length;
      reviewedFlashcards += set.cards.filter(
        (card) => card.reviewCount > 0
      ).length;
      starredFlashcards += set.cards.filter(
        (card) => card.isStarred
      ).length;
    });

    // Quiz statistics
    const quizzes = await Quiz.find({
      userId,
      completedAt: { $ne: null },
    });

    const averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce((sum, quiz) => sum + quiz.score, 0) /
              quizzes.length
          )
        : 0;

    // Recent Documents
    const recentDocuments = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    // Recent Quizzes
    const recentQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt score");

    // Merge documents + quizzes
    const recentActivity = [
      ...recentDocuments.map((doc) => ({
        _id: doc._id,
        title: `Uploaded "${doc.title}"`,
        type: "document",
        createdAt: doc.createdAt,
      })),

      ...recentQuizzes.map((quiz) => ({
        _id: quiz._id,
        title: `Generated Quiz "${quiz.title}"`,
        type: "quiz",
        createdAt: quiz.createdAt,
      })),
    ].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Study streak (temporary)
    const studyStreak = Math.floor(Math.random() * 7) + 1;
res.status(200).json({
  success: true,
  data: {
    user: {
      username: req.user.username,
      email: req.user.email,
    },

    overview: {
      totalDocuments,
      totalFlashcardSets,
      totalFlashcards,
      reviewedFlashcards,
      starredFlashcards,
      totalQuizzes,
      completedQuizzes,
      averageScore,
      studyStreak,
    },

    recentActivity,
  },
});
  } catch (error) {
    next(error);
  }
};