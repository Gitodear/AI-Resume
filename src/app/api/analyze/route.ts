import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeResume } from "@/lib/ai";

// Next.js 15+ Node runtime missing DOM globals that pdf-parse's internal pdf.js requires
if (typeof global.DOMMatrix === 'undefined') {
  (global as any).DOMMatrix = class DOMMatrix {};
}
if (typeof global.Path2D === 'undefined') {
  (global as any).Path2D = class Path2D {};
}
if (typeof global.ImageData === 'undefined') {
  (global as any).ImageData = class ImageData {};
}

const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "Missing file or job description" },
        { status: 400 }
      );
    }

    // Convert file to Buffer for pdf-parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PDF text
    let resumeText = "";
    try {
      const data = await pdfParse(buffer);
      resumeText = data.text;
    } catch (parseError) {
      console.error("PDF Parsing error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse PDF file" },
        { status: 400 }
      );
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "No text found in the PDF" },
        { status: 400 }
      );
    }

    // Call AI to analyze
    const analysis = await analyzeResume(resumeText, jobDescription);

    // Extract a simple job title from the description (first line or fallback)
    const jobTitleMatch = jobDescription.split('\\n')[0].substring(0, 50).trim() || 'Untitled Job';

    // Save to Supabase if authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error: insertError } = await supabase
        .from('analyses')
        .insert({
          user_id: user.id,
          job_title: jobTitleMatch,
          match_score: analysis.matchScore,
          results_json: analysis,
        });
        
      if (insertError) {
        console.error("Failed to save to database:", insertError);
        // We don't fail the request if saving fails, but we log it
      }
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
