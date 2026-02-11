import { GoogleGenAI, Type } from "@google/genai";
import { StudentResult, Subject, SyllabusRequest } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found in environment variables");
  return new GoogleGenAI({ apiKey });
};

export const fetchSyllabusFromAI = async (req: SyllabusRequest): Promise<Subject[]> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      Act as a database for Visvesvaraya Technological University (VTU).
      Provide the list of subjects for the ${req.branch} branch, ${req.semester} semester, under the ${req.scheme} scheme.
      
      Return a JSON array where each object represents a subject with:
      - 'code' (string): Subject code (e.g., 18CS51)
      - 'name' (string): Subject name
      - 'credits' (number): Number of credits (Usually 1, 2, 3, or 4)
      
      Do not include electives unless they are common core. Provide roughly 6-9 subjects common for this semester.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              name: { type: Type.STRING },
              credits: { type: Type.NUMBER },
            },
            required: ['code', 'name', 'credits']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Subject[];
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    throw error;
  }
};

export const parseResultPDF = async (base64File: string, mimeType: string): Promise<StudentResult> => {
  try {
    const ai = getAiClient();

    const prompt = `
      Analyze this VTU result document (or marks card).
      Extract the following information:
      1. Student Name (if visible, else empty)
      2. USN (University Seat Number) (if visible, else empty)
      3. Semester (number)
      4. List of subjects with their Codes, Names, Credits, and Grade Points obtained.
      
      If the document shows Marks (e.g., 85) but not Grade Points, calculate Grade Points based on VTU 2018/2021 standard:
      90-100=10, 80-89=9, 70-79=8, 60-69=7, 50-59=6, 45-49=5, 40-44=4, <40=0.
      
      If the document shows Grade Letter (S, A, B, etc.), map to:
      O/S+=10, S/A+=9, A=8, B=7, C=6, D=5, E=4, F=0.

      Calculate the SGPA if not explicitly present.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64File
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            usn: { type: Type.STRING },
            semester: { type: Type.NUMBER },
            sgpa: { type: Type.NUMBER },
            subjects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  name: { type: Type.STRING },
                  credits: { type: Type.NUMBER },
                  gradePoints: { type: Type.NUMBER },
                  gradeLetter: { type: Type.STRING }
                },
                required: ['code', 'credits', 'gradePoints']
              }
            }
          },
          required: ['sgpa', 'subjects']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to parse PDF");
    
    const data = JSON.parse(text);
    
    // Calculate Total Credits just in case
    let totalCredits = 0;
    data.subjects.forEach((s: any) => totalCredits += s.credits);

    return {
      ...data,
      totalCredits
    };

  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  }
};
