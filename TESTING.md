# Testing Guide for AI Resume Analyzer

This document outlines how to test the core features of the AI Resume Analyzer before deploying to production. 
Because this is an AI-powered app using third-party APIs (Supabase, Gemini), most testing relies on End-to-End (E2E) and integration manual verification.

## Prerequisites for Testing

1. Ensure your `.env.local` is fully configured with valid keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
2. Ensure you have run the `supabase_setup.sql` in your Supabase dashboard.
3. Start the local development server:
   ```bash
   npm run dev
   ```

## 1. Authentication Flow

**Objective**: Verify users can securely create accounts and log in.

- **Sign Up**:
  - Navigate to `http://localhost:3000/register`.
  - Enter a test email and password.
  - Click "Create account".
  - **Expected**: You should be automatically redirected to `/dashboard`. If email confirmation is enabled in Supabase by default, you may need to disable it for local testing or click the confirmation link sent to the email.
- **Log Out**:
  - Click the "Log out" button in the Navbar.
  - **Expected**: You should be redirected to `/`. The Navbar should now show "Log in" and "Sign up".
- **Log In**:
  - Navigate to `/login`.
  - Enter the test credentials you just created.
  - **Expected**: Redirected back to `/dashboard`.

## 2. Protected Routes

**Objective**: Ensure unauthenticated users cannot access private pages.

- Open a completely new Incognito window.
- Attempt to navigate directly to `http://localhost:3000/dashboard`.
- **Expected**: You are immediately redirected to `/login`.
- Attempt to navigate directly to `http://localhost:3000/dashboard/analyze`.
- **Expected**: Redirected to `/login` (assuming layout protection is set up, or handled per page).

## 3. The Core Analysis Engine (PDF + AI)

**Objective**: Verify the PDF parses correctly and the Gemini API returns valid JSON.

- **Preparation**: Get a sample PDF resume and copy a sample job description from LinkedIn or Indeed.
- **Action**:
  - Navigate to `/dashboard/analyze`.
  - Upload the PDF.
  - Paste the job description.
  - Click "Analyze Resume".
- **Expected Behavior**:
  - The button should go into a loading state ("Analyzing...").
  - After 3-10 seconds, the UI should transition to the Results view.
  - The Match Score should be a number (0-100).
  - The Matched Skills and Missing Skills arrays should have populated pills.
  - The AI Suggestions section should have a list of actionable bullet points.

## 4. History & Database Persistence

**Objective**: Verify analyses are saved correctly to Supabase.

- **Action**:
  - After completing Step 3, navigate back to `/dashboard`.
- **Expected Behavior**:
  - The "Total Analyses" count should be at least 1.
  - You should see the newly created analysis in the "Recent Analyses" list. The job title should roughly match the first line of the job description you pasted.
- **Action**:
  - Click on the new history item.
- **Expected Behavior**:
  - You should be routed to `/dashboard/history/[id]`.
  - The exact same results (score, skills, suggestions) from your analysis should render perfectly.

## Edge Cases to Test manually
- Uploading a non-PDF file (should trigger the HTML `accept` validation).
- Submitting the form with an empty job description or missing file (should be blocked).
- Attempting to view an analysis ID that doesn't exist (e.g. `/dashboard/history/99999999-9999-9999-9999-999999999999`). Should show the "Analysis Not Found" empty state.
