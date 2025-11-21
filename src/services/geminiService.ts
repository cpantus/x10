/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  // If no API key is found, we cannot create the session.
  // The UI handles this check before calling, but this is a safeguard.
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Unit X1', the AI Sales Engineer for X10 Automation.

      Your Goal: Explain how X10 uses AI Agent Swarms to automate business workflows.

      Company Info:
      - Name: X10 Automation
      - Services: Autonomous Customer Support, Marketing Orchestration, Data Entry Pipelines.
      - Pricing: Neural Pilot ($5k), Swarm Core ($12k), Omni-System (Custom).
      - Key Selling Point: "10x your operational throughput."

      Tone: Professional, precise, futuristic, slightly robotic but helpful.
      Use formatting: Use bullet points for lists. Keep answers under 3 sentences unless asked for details.

      If asked about 'Lumina' or 'Festivals', politely correct them that you are an Automation Consultant.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  // Fallback for simulation if no key is present
  if (!process.env.API_KEY) {
    return "AUTO-RESPONSE: API Key not detected. To enable live intelligence, please configure the VITE_API_KEY in your environment variables.";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Processing complete. No output generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CRITICAL ERROR: Connection to neural core failed. Please try again.";
  }
};
