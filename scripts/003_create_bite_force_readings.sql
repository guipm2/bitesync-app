-- Create bite force readings table
create table if not exists public.bite_force_readings (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  force_value numeric not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  session_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bite_force_readings enable row level security;

-- RLS policies for bite force readings
create policy "bite_force_readings_select_own"
  on public.bite_force_readings for select
  using (auth.uid() = user_id);

create policy "bite_force_readings_insert_own"
  on public.bite_force_readings for insert
  with check (auth.uid() = user_id);

create policy "bite_force_readings_update_own"
  on public.bite_force_readings for update
  using (auth.uid() = user_id);

create policy "bite_force_readings_delete_own"
  on public.bite_force_readings for delete
  using (auth.uid() = user_id);
