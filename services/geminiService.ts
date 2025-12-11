import { GoogleGenAI } from "@google/genai";
import { PlayerConfig, CellValue } from '../types';

// Initialize Gemini
// NOTE: We assume process.env.API_KEY is available as per instructions.
let ai: GoogleGenAI | null = null;
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("Gemini API Key missing. Commentary feature will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

export const generateCommentary = async (
  grid: CellValue[],
  lastMoveIndex: number,
  player: PlayerConfig,
  gameStatus: 'ongoing' | 'win' | 'draw'
): Promise<string> => {
  if (!ai) return "Commentator is on a coffee break (API Key missing).";

  const model = "gemini-2.5-flash"; // Using flash for speed

  // Construct a simple text representation of the board for the AI
  // We don't need the full grid, just context.
  const prompt = `
    You are an energetic, slightly sarcastic color commentator for a 3-player Tic-Tac-Toe match (Connect 4 on 6x6 grid).
    
    Current Event:
    - Player: ${player.name} (${player.icon})
    - Move Location Index: ${lastMoveIndex}
    - Game Status: ${gameStatus}
    
    Task:
    Provide a ONE sentence reaction. 
    If the game is ongoing, hype the move or roast it if it looks random.
    If it's a win, celebrate the player.
    If it's a draw, complain about the anticlimax.
    
    Keep it short, punchy, and fun. Max 20 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text?.trim() || "Unbelievable scenes here at the arena!";
  } catch (error) {
    console.error("Gemini commentary error:", error);
    return "Technical difficulties in the commentary box!";
  }
};
