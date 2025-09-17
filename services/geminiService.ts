
import { GoogleGenAI } from "@google/genai";
import { StoryTurn } from '../types';

if (!import.meta.env.VITE_API_KEY) {
  throw new Error("VITE_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const SYSTEM_INSTRUCTION = `You are a master storyteller and game master for a dynamic text-based adventure game. Your goal is to create an engaging, descriptive, and coherent narrative based on the user's actions.
- Describe the outcome of the user's action.
- Describe the new scene, environment, or situation in vivid detail.
- Present a new challenge, a mystery, or a clear path forward.
- Keep the tone consistent with a dark fantasy setting.
- Be creative and sometimes introduce unexpected events.
- Respond ONLY with the next part of the story. Do not add any conversational filler like 'Great choice!' or 'Here is the next part of your adventure.'
- Keep the story concise, about 2-3 paragraphs per response.`;

export const startNewGame = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Start a new, exciting text-based adventure game for me. Begin with a compelling opening scene in a classic dark fantasy setting. Describe a mysterious and slightly unsettling environment and give me a starting point for my first action. Make it intriguing.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error starting new game:", error);
    return "Error: Could not start a new game. The ancient magic has failed. Please check the console and try refreshing.";
  }
};

export const generateNextTurn = async (history: StoryTurn[], playerAction: string): Promise<string> => {
  const formattedHistory = history.map(turn => {
    return `${turn.isPlayer ? 'Player' : 'Game Master'}: ${turn.isPlayer ? turn.playerAction : turn.scenario}`;
  }).join('\n');

  const prompt = `${formattedHistory}\nPlayer: ${playerAction}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating next turn:", error);
    return "Error: The world fades to black... something went wrong. Please check the console and try your action again.";
  }
};
