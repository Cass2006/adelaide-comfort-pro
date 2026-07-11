// Supabase Edge Function (Deno). Sends a booking notification to the
// business owner and a confirmation to the customer via Resend.
// Requires the RESEND_API_KEY secret to be set on the project.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const BUSINESS_NOTIFICATION_EMAIL = "araujomadaz2006@gmail.com";
const FROM_ADDRESS = "Adelaide HVAC Services <onboarding@resend.dev>";
const BRAND = "#10B5DF";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SERVICE_LABELS: Record<string, string> = {
  "air-conditioning": "Air Conditioning",
  heating: "Heating",
  ventilation: "Ventilation",
  "heat-pump": "Heat Pump",
  refrigeration: "Refrigeration",
  electrical: "Electrical",
  maintenance: "Maintenance",
  "new-installation": "New Installation",
  inspection: "Inspection / Diagnosis",
};

const URGENCY_LABELS: Record<string, string> = {
  normal: "Normal — schedule for a convenient date",
  today: "Today — same-day service if available",
  emergency: "Emergency 24/7 — immediate response",
};

const CONTACT_METHOD_LABELS: Record<string, string> = {
  phone: "Phone call",
  sms: "SMS",
  email: "Email",
};

interface BookingPayload {
  service?: string;
  urgency?: string;
  description?: string;
  accessNotes?: string;
  photoUrls?: string[];
  address?: string;
  city?: string;
  zip?: string;
  date?: string;
  slot?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  contactMethod?: string;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eef2f5;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid #eef2f5;color:#0f172a;font-size:15px;">${value}</td>
    </tr>`;
}

function buildEmailHtml(opts: { heading: string; intro: string; booking: BookingPayload; customerName: string }) {
  const { heading, intro, booking, customerName } = opts;

  const rows = [
    row("Service", escapeHtml(SERVICE_LABELS[booking.service ?? ""] ?? booking.service ?? "—")),
    row("Urgency", escapeHtml(URGENCY_LABELS[booking.urgency ?? ""] ?? booking.urgency ?? "—")),
    row("Date", escapeHtml(formatDate(booking.date)) + (booking.slot ? ` &middot; ${escapeHtml(booking.slot)}` : "")),
    row("Address", escapeHtml([booking.address, booking.city, booking.zip].filter(Boolean).join(", ") || "—")),
  ];

  if (booking.description) {
    rows.push(row("Issue description", escapeHtml(booking.description)));
  }
  if (booking.accessNotes) {
    rows.push(row("Access notes", escapeHtml(booking.accessNotes)));
  }

  rows.push(row("Customer", escapeHtml(customerName)));
  rows.push(row("Phone", escapeHtml(booking.phone ?? "—")));
  rows.push(row("Email", escapeHtml(booking.email ?? "—")));
  rows.push(row("Preferred contact", escapeHtml(CONTACT_METHOD_LABELS[booking.contactMethod ?? ""] ?? booking.contactMethod ?? "—")));

  const photosHtml =
    booking.photoUrls && booking.photoUrls.length > 0
      ? `
    <tr>
      <td colspan="2" style="padding:16px 0 0;">
        <div style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px;">Photos (${booking.photoUrls.length})</div>
        <div>
          ${booking.photoUrls
            .map(
              (url) =>
                `<a href="${url}" style="display:inline-block;margin:0 8px 8px 0;"><img src="${url}" width="90" height="90" style="border-radius:8px;object-fit:cover;border:1px solid #e2e8f0;" /></a>`,
            )
            .join("")}
        </div>
      </td>
    </tr>`
      : "";

  return `
  <div style="background:#f1f5f9;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div style="background:${BRAND};padding:24px 28px;">
        <div style="color:#ffffff;font-weight:800;font-size:18px;letter-spacing:.02em;">ADELAIDE HVAC SERVICES</div>
      </div>
      <div style="padding:28px;">
        <h1 style="margin:0 0 8px;font-size:20px;color:#0f172a;">${escapeHtml(heading)}</h1>
        <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.5;">${escapeHtml(intro)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rows.join("")}
          ${photosHtml}
        </table>
      </div>
      <div style="padding:16px 28px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center;">
        Adelaide HVAC Services &middot; Licensed &amp; Insured &middot; Available 24/7
      </div>
    </div>
  </div>`;
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
    const serviceLabel = SERVICE_LABELS[booking.service ?? ""] ?? booking.service ?? "HVAC service";

    const results = await Promise.all([
      sendEmail(
        BUSINESS_NOTIFICATION_EMAIL,
        `New booking: ${serviceLabel} — ${customerName}`,
        buildEmailHtml({
          heading: "New booking received",
          intro: "A customer just submitted a booking through the website.",
          booking,
          customerName,
        }),
      ),
      booking.email
        ? sendEmail(
            booking.email,
            "Your Adelaide HVAC Services booking is confirmed",
            buildEmailHtml({
              heading: `Thanks, ${customerName.split(" ")[0]}!`,
              intro: "We've received your appointment request. Our team will call you shortly to confirm.",
              booking,
              customerName,
            }),
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
