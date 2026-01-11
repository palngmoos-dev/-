import { GoogleGenAI, Type } from "@google/genai";

export const generateTravelItinerary = async (query: string) => {
  // 안전하게 API_KEY에 접근합니다.
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  
  if (!apiKey) {
    throw new Error("API_KEY가 설정되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `사용자가 다음 여행 테마로 일정을 요청했습니다: "${query}". 
    이 요청을 바탕으로 아주 감성적이고 귀여운 말투의 유럽 여행 일정을 만들어주세요. 
    "AI"라는 단어는 절대 쓰지 마세요. 마치 여행 전문가 친구가 속삭여주는 것처럼 작성해주세요.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "여행의 제목 (예: 파리에서의 달콤한 5일)" },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                activity: { type: Type.STRING, description: "그날의 핵심 활동" },
                description: { type: Type.STRING, description: "활동에 대한 감성적인 설명" }
              },
              required: ["day", "activity", "description"]
            }
          },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "그 여행지를 위한 꿀팁 3가지"
          }
        },
        required: ["title", "days", "tips"]
      }
    }
  });

  const text = response.text || "";
  return JSON.parse(text.trim());
};