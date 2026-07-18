import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    title: {
      type: String,
      default: "Flashcard Set",
    },

    cards: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          required: true,
        },

        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },

        lastReviewed: {
          type: Date,
          default: null,
        },

        reviewCount: {
          type: Number,
          default: 0,
        },

        isStarred: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

flashcardSchema.virtual("reviewedCards").get(function () {
  return this.cards.filter(
    (card) => card.reviewCount > 0
  ).length;
});

flashcardSchema.virtual("progress").get(function () {
  if (this.cards.length === 0) return 0;

  return Math.round(
    (this.reviewedCards / this.cards.length) * 100
  );
});

flashcardSchema.set("toJSON", {
  virtuals: true,
});

flashcardSchema.set("toObject", {
  virtuals: true,
});

flashcardSchema.index({
  userId: 1,
  documentId: 1,
});

const Flashcard = mongoose.model(
  "Flashcard",
  flashcardSchema
);

export default Flashcard;