import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

if (!process.env.GROQ_API_KEY) {
  console.error(
    "FATAL ERROR: GROQ_API_KEY is not set in the environment variables."
  );
  process.exit(1);
}


/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards
 * @returns {Promise<Array>}
 */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards from the following text.

Return ONLY valid JSON in this format:

[
  {
    "question": "...",
    "answer": "...",
    "difficulty": "easy"
  }
]

Difficulty must be one of:
easy, medium, hard

Text:

${text.substring(0, 15000)}
`;

  try {
    const generatedText = await generateResponse(prompt);

    const json = generatedText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const flashcards = JSON.parse(json);

    return flashcards.slice(0, count);
  } catch (error) {
    console.error("Groq Flashcard Error:", error);
    throw new Error("Failed to generate flashcards");
  }
};
/**
 * Generate quiz questions
 * @param {string} text - Document text
 * @param {number} numQuestions - Number of questions
 * @returns {Promise<Array>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate exactly ${numQuestions} multiple-choice questions from the following text.

Return ONLY valid JSON in this format:

[
  {
    "question": "...",
    "options": [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ],
    "correctAnswer": "Option 2",
    "explanation": "...",
    "difficulty": "easy"
  }
]

Rules:
- Exactly 4 options.
- correctAnswer must exactly match one option.
- difficulty must be easy, medium or hard.
- Return ONLY JSON.

Text:

${text.substring(0, 15000)}
`;

  try {
    const generatedText = await generateResponse(prompt);

    const json = generatedText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(json);

    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error("Groq Quiz Error:", error);
    throw new Error("Failed to generate quiz");
  }
};
/**
 * Generate document summary
 * @param {string} text
 * @returns {Promise<string>}
 */
export const generateSummary = async (text) => {
  const prompt = `You are an educational AI assistant.

Generate a well-structured summary of the following document.

Requirements:
- Explain the main idea.
- Mention important concepts.
- Use headings and bullet points where appropriate.
- Keep it concise and easy to understand.

Document:

${text.substring(0, 20000)}
`;

  try {
    return await generateResponse(prompt);
  } catch (error) {
    console.error("Groq Summary Error:", error);
    throw new Error("Failed to generate summary");
  }
};
/**
 * Chat with document context
 * @param {string} question
 * @param {Array<Object>} chunks
 * @returns {Promise<string>}
 */
export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, index) => `[Chunk ${index + 1}]\n${c.content}`)
    .join("\n\n");

  const prompt = `
You are an intelligent educational tutor.

Answer ONLY using the provided document context.

If the answer is not present in the document, reply:

"I couldn't find that information in the uploaded document."

Document Context:

${context}

Student Question:

${question}

Answer:
`;

  try {
    return await generateResponse(prompt);
  } catch (error) {
    console.error("Groq Chat Error:", error);
    throw new Error("Failed to process chat request");
  }
};
/**
 * Explain a specific concept
 * @param {string} concept
 * @param {string} context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
  const prompt = `
You are an expert educational tutor.

Explain the following concept clearly.

Concept:
${concept}

Reference Context:
${context.substring(0, 12000)}

Instructions:
- Explain in simple language.
- Use bullet points.
- Give examples if applicable.
- Mention important facts.
- Keep it easy for a student to understand.

Answer:
`;

  try {
    return await generateResponse(prompt);
  } catch (error) {
    console.error("Groq Explain Error:", error);
    throw new Error("Failed to explain concept");
  }
};
const generateResponse = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "You are LearnMind AI, an intelligent educational assistant that provides accurate, concise and well-structured answers."
        },
        {
          role: "user",
          content: prompt
        }
      ],

      temperature: 0.3,
      max_tokens: 2048,
      top_p: 1,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
};