
-- 1) Remove permissive public storage policies on booking-photos
DROP POLICY IF EXISTS "Public can view booking photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload booking photos" ON storage.objects;

-- No replacement policies: access to booking-photos is now exclusively via
-- the server function using the service role (which bypasses RLS).

-- 2) Replace overly permissive INSERT policy on public.bookings with basic validation
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;

CREATE POLICY "Public can insert validated bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(btrim(email)) >= 5
    AND email LIKE '%_@_%.__%'
    AND length(btrim(phone)) >= 5
    AND length(btrim(first_name)) > 0
    AND length(btrim(last_name)) > 0
    AND length(btrim(address)) > 0
    AND length(btrim(city)) > 0
    AND length(btrim(zip)) > 0
    AND length(btrim(service)) > 0
    AND length(btrim(time_slot)) > 0
    AND status = 'pending'
    AND urgency IN ('normal','today','emergency')
    AND contact_method IN ('phone','sms','email')
    AND coalesce(array_length(photo_urls, 1), 0) <= 20
    AND preferred_date >= (current_date - interval '1 day')
  );
