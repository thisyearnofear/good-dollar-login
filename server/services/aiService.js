/**
 * AI suggestion service using OpenAI.
 */
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

/**
 * Get intersection suggestions for two topics using OpenAI ChatCompletion.
 * @param {string[]} topics
 * @returns {Promise<string[]>}
 */
export async function getSuggestions(topics) {
  if (!Array.isArray(topics) || topics.length < 2)
    throw new Error("Must provide at least two topics.");

  const prompt = `
Given these two topics: "${topics[0]}" and "${topics[1]}", suggest 5 creative, single-word commonalities or intersections that could fit in a Venn diagram. Only return the words as a JSON array.
`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant for creative diagramming." },
      { role: "user", content: prompt }
    ],
    max_tokens: 70,
    temperature: 0.7
  });

  const raw = response.data.choices?.[0]?.message?.content?.trim();
  try {
    // Try to parse direct JSON array, e.g., ["x","y"]
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.map(String);
  } catch (e) {
    // Fallback: extract words from lines
    return raw
      .replace(/[\[\]\"]+/g, "")
      .split(/[\n,]/)
      .map((w) => w.trim())
      .filter(Boolean)
      .slice(0, 5);
  }
  throw new Error("AI model did not return suggestions in expected format.");
}