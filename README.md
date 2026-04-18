# 🚀 AI Resume Analyzer

**Live Demo:** [https://ai-resume.vercel.app](https://ai-resume.vercel.app) *(Note: You must deploy to Vercel for this link to become active)*

A premium, full-stack Next.js web application that uses Google's Gemini AI to act as an expert Applicant Tracking System (ATS). It analyzes PDF resumes against job descriptions to provide detailed match scores, identify missing skills, and offer actionable improvement suggestions.

## ✨ Features
- **AI-Powered Analysis**: Uses the Gemini 2.5 API for intelligent resume-to-job matching.
- **Secure Authentication**: Full user login and session management powered by Supabase.
- **Persistent History**: Saves all past analyses to a personal, secure database dashboard.
- **Server-Side Processing**: Secure, API-driven PDF extraction without exposing files to the browser.
- **Modern UI**: A responsive, dark-mode design built with Tailwind CSS v4 and glassmorphism UI components.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router, Server Actions)
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase (PostgreSQL)
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Deployment**: Vercel
