// Supabase Edge Function (Deno). Sends a booking notification to the
// business owner and a confirmation to the customer via Resend.
// Requires the RESEND_API_KEY secret to be set on the project.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const BUSINESS_NOTIFICATION_EMAIL = "araujomadaz2006@gmail.com";
const FROM_ADDRESS = "Adelaide HVAC Services <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingPayload {
  service?: string;
  urgency?: string;
  address?: string;
  city?: string;
  zip?: string;
  date?: string;
  slot?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`Resend error sending to ${to}:`, res.status, body);
  }
  return { ok: res.ok, status: res.status, body };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const booking = (await req.json()) as BookingPayload;
    const customerName = [booking.firstName, booking.lastName].filter(Boolean).join(" ") || "Customer";

    const detailsHtml = `
      <ul>
        <li><strong>Service:</strong> ${booking.service ?? "—"}</li>
        <li><strong>Urgency:</strong> ${booking.urgency ?? "—"}</li>
        <li><strong>Date:</strong> ${booking.date ?? "—"} (${booking.slot ?? "—"})</li>
        <li><strong>Address:</strong> ${booking.address ?? "—"}, ${booking.city ?? "—"}, ${booking.zip ?? "—"}</li>
        <li><strong>Customer:</strong> ${customerName} — ${booking.phone ?? "—"} — ${booking.email ?? "—"}</li>
      </ul>
    `;

    const results = await Promise.all([
      sendEmail(
        BUSINESS_NOTIFICATION_EMAIL,
        `New booking: ${booking.service ?? "HVAC service"} — ${customerName}`,
        `<h2>New booking received</h2>${detailsHtml}`,
      ),
      booking.email
        ? sendEmail(
            booking.email,
            "Your Adelaide HVAC Services booking is confirmed",
            `<h2>Thanks, ${customerName}!</h2><p>We've received your appointment request.</p>${detailsHtml}`,
          )
        : Promise.resolve({ ok: true, status: 0, body: { skipped: true } }),
    ]);

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-booking-confirmation failed:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
