-- Create patients table
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  birth_date date,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.patients enable row level security;

-- RLS policies for patients
create policy "patients_select_own"
  on public.patients for select
  using (auth.uid() = user_id);

create policy "patients_insert_own"
  on public.patients for insert
  with check (auth.uid() = user_id);

create policy "patients_update_own"
  on public.patients for update
  using (auth.uid() = user_id);

create policy "patients_delete_own"
  on public.patients for delete
  using (auth.uid() = user_id);
