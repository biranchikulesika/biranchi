-- Set up Storage for the app
-- (Assuming a public bucket for images/assets if needed)

-- Create a bucket
insert into storage.buckets (id, name, public)
values ('public_assets', 'public_assets', true)
on conflict (id) do nothing;

-- Set up security rules
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'public_assets' );

create policy "Auth Insert"
  on storage.objects for insert
  with check ( auth.role() = 'authenticated' AND bucket_id = 'public_assets' );
