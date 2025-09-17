-- Add missing fields and constraints to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birth_date date,
ADD CONSTRAINT unique_cpf UNIQUE (cpf);

-- Create index for better performance on CPF lookups
CREATE INDEX IF NOT EXISTS idx_profiles_cpf ON public.profiles(cpf);

-- Update the trigger to handle all fields properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, cpf, phone, birth_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'cpf', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'birth_date' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'birth_date')::date 
      ELSE NULL 
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    cpf = COALESCE(EXCLUDED.cpf, profiles.cpf),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    birth_date = COALESCE(EXCLUDED.birth_date, profiles.birth_date),
    updated_at = NOW();

  RETURN NEW;
END;
$$;
