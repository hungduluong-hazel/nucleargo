-- Refresh handle_new_user trigger with explicit tier default
-- Safe to re-run: uses CREATE OR REPLACE / DROP IF EXISTS

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, first_name, last_name,
    organization, country, role, tier
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'organization',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'role',
    2
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Allow users to insert their own profile row.
-- Required for the fallback upsert on profile page load when the
-- trigger did not fire (e.g. user registered before migration ran).
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
