DROP POLICY IF EXISTS "Public can insert validated bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anonymous booking submissions" ON public.bookings;

CREATE POLICY "Allow anonymous booking submissions"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);