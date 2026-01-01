
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";

// Utility to create a numeric seed for the LLM
const getNumericSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const generateMoodContent = async (moodEmoji: string, dateStr: string) => {
  // Fix: Initialize GoogleGenAI with the required environment variable
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const seed = getNumericSeed(dateStr + moodEmoji);

  try {
    // Fix: Call Gemini API using the recommended generateContent method
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `【任务指令】
日期：${dateStr}
心情符号：${moodEmoji}

请严格根据上述心情和日期检索一条真实的文学引文。
1. 准确性：必须确保引文确实出自所标注的作家，严禁张冠李戴。
2. 唯一性：不同的心情符号（Emoji）必须映射到不同风格或不同作家的句子。
3. 格式：每行文字不得超过20个字符。
4. 稳定性：请参考检索种子以保持输出质量。`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
        seed: seed,
      },
    });

    // Fix: Access the text output via the .text property (not a method)
    let quote = response.text?.trim() || "草在结它的种子，\n风在摇它的叶子，\n我们站着，不说话就十分美好。\n——顾城";
    
    // Clean up potential markdown formatting from the LLM output
    quote = quote.replace(/\*\*/g, '');
    
    return { quote };

  } catch (error) {
    console.error("Gemini AI Retrieval failed:", error);
    return { quote: "草在结它的种子，\n风在摇它的叶子，\n我们站着，不说话就十分美好。\n——顾城" };
  }
};
