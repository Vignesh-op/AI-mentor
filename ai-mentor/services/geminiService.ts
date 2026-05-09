

import { GoogleGenAI, Chat, GenerativeModel, Modality } from "@google/genai";
import { MENTOR_PERSONA, RESUME_ANALYZER_INSTRUCTION, JOB_VACANCY_INSTRUCTION, PLACEMENT_PREP_INSTRUCTION, CAREER_ROADMAP_INSTRUCTION } from "../constants";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing!");
      throw new Error("API Key is missing from environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const createChat = (systemInstruction: string = MENTOR_PERSONA): Chat => {
  const ai = getAI();
  // Using gemini-3-pro-preview for high quality chat interactions as requested
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string, onChunk: (text: string) => void): Promise<string> => {
  try {
    const result = await chat.sendMessageStream({ message });
    let fullText = "";
    for await (const chunk of result) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const generatePlacementPrep = async (company: string, role: string, experience: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Generate a complete 4-round placement preparation guide for a ${experience} level ${role} position at ${company}.
  
  The guide must cover:
  1. Aptitude Round
  2. Technical Test / Coding Round
  3. Technical Interview
  4. HR Interview

  Follow the strict Markdown output format defined in the system instructions.`;

  try {
    // Use gemini-2.5-flash with googleSearch for up-to-date info
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: PLACEMENT_PREP_INSTRUCTION,
      },
    });

    let text = response.text || "Sorry, I couldn't generate the guide.";
    
    // Append grounding sources if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      text += "\n\n### Sources\n";
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
        }
      });
    }

    return text;
  } catch (error) {
    console.error("Error generating placement prep:", error);
    return "Error generating content. Please try again.";
  }
};

export const generateJobVacancies = async (role: string, experience: string, companyContext: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Find 5-8 REAL, ACTIVE, and CURRENTLY OPEN job vacancies for a ${experience} level ${role} position.
  Context/Location: ${companyContext || "India/Global"}.
  
  CRITICAL REQUIREMENTS:
  1. Search for jobs posted in the LAST 30 DAYS only.
  2. Verify the links are valid and active.
  3. Prefer direct career page links or major job board posts (LinkedIn, Naukri).
  4. STRICTLY avoid expired or closed jobs.
  
  Follow the strict output format defined in the system instructions.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Added googleSearch tool for real job data
        systemInstruction: JOB_VACANCY_INSTRUCTION,
      },
    });

    let text = response.text || "Could not generate vacancies.";

    // Append grounding sources if available to transparently show where jobs were found
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      text += "\n\n### Verified Sources\n";
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
        }
      });
    }
    
    return text;
  } catch (error) {
    console.error("Error generating vacancies:", error);
    return "Error generating vacancies. Please try again.";
  }
};

export const generateCareerRoadmap = async (domain: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Generate a complete career roadmap from Fresher to Pro for the domain: ${domain}.
  Include specific skills (Python, SQL, etc.), tools, project ideas, and a timeline.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: CAREER_ROADMAP_INSTRUCTION,
      },
    });
    return response.text || "Could not generate roadmap.";
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return "Error generating content. Please try again.";
  }
};

// Helper to convert File to Base64 for Gemini
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove the Data URL prefix to get raw base64
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const analyzeResume = async (
  content: string | File,
  role: string = "General"
): Promise<string> => {
  const ai = getAI();
  const instruction = RESUME_ANALYZER_INSTRUCTION.replace('{{ROLE}}', role);
  
  const prompt = `Please analyze this resume for a ${role} position. Provide detailed feedback, ATS keywords, and specific improvements to bullet points.`;
  
  let parts: any[] = [{ text: prompt }];

  if (typeof content === 'string') {
    parts.push({ text: `Resume Content:\n${content}` });
  } else {
    // Handle File (PDF/Image)
    const base64Data = await fileToGenerativePart(content);
    parts.push(base64Data);
  }

  try {
    // Using gemini-3-pro-preview for complex analysis of documents
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: instruction,
      },
    });
    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Resume analysis failed", error);
    throw error;
  }
};

export const generateSpeech = async (text: string): Promise<Uint8Array> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO], 
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    
    return base64ToBytes(base64Audio);
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

// Helper: Decode Base64 to Uint8Array
function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}