import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const models = await ai.models.list();

    for await (const model of models) {
      console.log(model.name);
      console.log(model.supportedActions);
      console.log("------------------------");
    }
  } catch (err) {
    console.error(err);
  }
}

main();