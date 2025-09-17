-- Updated trigger to save all user metadata fields
-- Drop existing trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create updated function to handle all user metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    email, 
    cpf, 
    phone, 
    birth_date,
    created_at,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'cpf', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    case 
      when new.raw_user_meta_data ->> 'birth_date' is not null 
      then (new.raw_user_meta_data ->> 'birth_date')::date 
      else null 
    end,
    now(),
    now()
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    cpf = excluded.cpf,
    phone = excluded.phone,
    birth_date = excluded.birth_date,
    updated_at = now();

  return new;
end;
$$;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
