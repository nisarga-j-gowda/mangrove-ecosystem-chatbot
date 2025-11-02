
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

let chat: Chat | null = null;

function getChatInstance(): Chat {
  if (!chat) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are an expert on mangroves and coastal ecosystems. Answer questions clearly and concisely, focusing on this topic. Be friendly and engaging. Your knowledge is specialized in this area.',
      },
    });
  }
  return chat;
}

export async function sendMessageToBot(message: string, history: ChatMessage[]): Promise<string> {
  try {
    const chatInstance = getChatInstance();
    // Re-establishing history for context is useful, though Chat object maintains state.
    // For this simple app, we just send the latest message.
    // A more complex app might rebuild history from the state.
    const response = await chatInstance.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
}
