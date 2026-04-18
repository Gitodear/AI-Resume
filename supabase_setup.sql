-- Create a table for storing analysis results
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_title text not null,
  match_score integer not null,
  results_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.analyses enable row level security;

-- Create policies so users can only read/insert their own analyses
create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

-- Create a storage bucket for temporary PDF processing (optional, we might just parse in memory)
-- But if we want to save them:
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false);

create policy "Users can upload own resumes"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own resumes"
  on storage.objects for select
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
