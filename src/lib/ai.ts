import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeResume(resumeText: string, jobDescription: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert ATS (Applicant Tracking System) and senior recruiter. 
    Analyze the following resume against the provided job description.
    
    Resume Text:
    """
    ${resumeText}
    """
    
    Job Description:
    """
    ${jobDescription}
    """
    
    Return a JSON response with the following structure exactly (do not wrap in markdown tags like \`\`\`json, just return the raw JSON string):
    {
      "matchScore": <number between 0 and 100 representing the percentage match>,
      "matchedSkills": [<array of strings of key skills found in both>],
      "missingSkills": [<array of strings of key skills in job description but missing in resume>],
      "suggestions": [<array of strings of actionable advice to improve the resume for this specific job>]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Attempt to parse the JSON. Sometimes models wrap it in markdown.
    let cleanText = text.trim();
    if (cleanText.startsWith('\`\`\`json')) {
      cleanText = cleanText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume with AI");
  }
}
