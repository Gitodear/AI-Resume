# Deployment Guide for AI Resume Analyzer

This application is built with Next.js (App Router), making it perfectly suited for deployment on Vercel, the platform created by the makers of Next.js.

## Prerequisites

Before deploying, ensure you have:
1. A GitHub, GitLab, or Bitbucket account with this repository pushed.
2. A [Vercel](https://vercel.com/) account.
3. Your production API keys ready:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`

## Step-by-Step Vercel Deployment

1. **Push to GitHub**:
   Ensure all your code is committed and pushed to your git repository.

2. **Import Project to Vercel**:
   - Go to your Vercel dashboard and click **"Add New..."** > **"Project"**.
   - Connect your Git provider and select the `ai-resume-analyzer` repository.

3. **Configure Project Settings**:
   - **Framework Preset**: Vercel should automatically detect **Next.js**.
   - **Root Directory**: Leave as `./` (or select the subfolder if your Next.js app isn't at the root of the repo).
   
4. **Set Environment Variables**:
   In the **Environment Variables** section, add the following keys exactly as they appear in your `.env.local` file:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` | Value: `[Your Supabase URL]`
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Value: `[Your Supabase Anon Key]`
   - Name: `GEMINI_API_KEY` | Value: `[Your Gemini API Key]`

5. **Deploy**:
   - Click the **"Deploy"** button.
   - Vercel will now build your project. Because we are using standard Next.js API routes with Node.js runtime, `pdf-parse` will compile and run successfully in Vercel's serverless functions.

6. **Post-Deployment Checks**:
   - Once the build finishes, Vercel will assign a production URL (e.g., `https://ai-resume-analyzer.vercel.app`).
   - Open the URL and attempt to sign up for a new account to verify the Supabase integration works in production.
   - Run a test analysis to ensure the Gemini API is responding correctly in the deployed environment.

## Important Note on Supabase Redirects
By default, Supabase authentication redirects to `localhost:3000` after operations like password resets or email confirmations. 
You **must** go into your Supabase Dashboard -> **Authentication** -> **URL Configuration** and add your new Vercel production URL (e.g., `https://ai-resume-analyzer.vercel.app`) to the **Site URL** and **Redirect URLs** list. Otherwise, authentication flows will break in production.
