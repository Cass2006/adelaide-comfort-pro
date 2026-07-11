
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  service text NOT NULL,
  urgency text NOT NULL DEFAULT 'normal',
  description text,
  photo_urls text[] NOT NULL DEFAULT '{}',
  address text NOT NULL,
  city text NOT NULL,
  zip text NOT NULL,
  access_notes text,
  preferred_date date NOT NULL,
  time_slot text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  contact_method text NOT NULL DEFAULT 'phone',
  status text NOT NULL DEFAULT 'pending'
);

GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can upload booking photos"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'booking-photos');

CREATE POLICY "Public can view booking photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'booking-photos');
