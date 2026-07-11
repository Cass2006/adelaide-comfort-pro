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
      <td style="padding:12px 0;border-bottom:1px solid #eef2f5;">
        <div style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px;">${label}</div>
        <div style="color:#0f172a;font-size:16px;line-height:1.4;word-break:break-word;">${value}</div>
      </td>
    </tr>`;
}

function buildEmailHtml(opts: { heading: string; intro: string; booking: BookingPayload; customerName: string; signoff?: boolean }) {
  const { heading, intro, booking, customerName, signoff } = opts;

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
      <td style="padding:16px 0 0;">
        <div style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px;">Photos (${booking.photoUrls.length})</div>
        <div>
          ${booking.photoUrls
            .map(
              (url) =>
                `<a href="${url}" style="display:inline-block;margin:0 8px 8px 0;"><img src="${url}" width="84" height="84" class="photo-thumb" style="border-radius:8px;object-fit:cover;border:1px solid #e2e8f0;" /></a>`,
            )
            .join("")}
        </div>
      </td>
    </tr>`
      : "";

  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<style>
  body { margin:0; }
  @media only screen and (max-width: 480px) {
    .email-wrap { padding: 16px 8px !important; }
    .email-card { border-radius: 12px !important; }
    .email-header { padding: 18px 18px !important; }
    .email-body { padding: 20px 18px !important; }
    .email-footer { padding: 14px 18px !important; }
    .email-heading { font-size: 18px !important; }
    .photo-thumb { width: 72px !important; height: 72px !important; }
  }
</style>
</head>
<body>
  <div class="email-wrap" style="background:#f1f5f9;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div class="email-card" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div class="email-header" style="background:${BRAND};padding:24px 28px;">
        <div style="color:#ffffff;font-weight:800;font-size:17px;letter-spacing:.02em;">ADELAIDE HVAC SERVICES</div>
      </div>
      <div class="email-body" style="padding:28px;">
        <h1 class="email-heading" style="margin:0 0 8px;font-size:20px;line-height:1.3;color:#0f172a;">${escapeHtml(heading)}</h1>
        <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.5;">${escapeHtml(intro)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rows.join("")}
          ${photosHtml}
        </table>
        ${
          signoff
            ? `<p style="margin:22px 0 0;color:#475569;font-size:14px;line-height:1.6;">
                 Talk soon,<br />
                 <strong style="color:#0f172a;">The Adelaide HVAC Services team</strong> 🔧
               </p>`
            : ""
        }
      </div>
      <div class="email-footer" style="padding:16px 28px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center;">
        Adelaide HVAC Services &middot; Licensed &amp; Insured &middot; Available 24/7
      </div>
    </div>
  </div>
</body>
</html>`;
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
    const firstName = booking.firstName || customerName.split(" ")[0] || "there";
    const serviceLabel = SERVICE_LABELS[booking.service ?? ""] ?? booking.service ?? "HVAC service";

    const customerIntro =
      booking.urgency === "emergency"
        ? "Thanks for reaching out — we know this can't wait. One of our technicians will call you shortly to get someone out to you as fast as we can."
        : booking.urgency === "today"
          ? "Thanks for booking with us! We'll do our best to get a technician out to you today — we'll call shortly to lock in the details."
          : "Thanks for booking with us! Here's a quick recap of your appointment — we'll give you a call to confirm everything before we head out.";

    const results = await Promise.all([
      sendEmail(
        BUSINESS_NOTIFICATION_EMAIL,
        `New booking from ${customerName} — ${serviceLabel}`,
        buildEmailHtml({
          heading: "Heads up — a new booking just came in! 👋",
          intro: `${customerName} just booked ${serviceLabel.toLowerCase()} online. Here's everything you need before heading out.`,
          booking,
          customerName,
        }),
      ),
      booking.email
        ? sendEmail(
            booking.email,
            `You're booked in, ${firstName}!`,
            buildEmailHtml({
              heading: `You're all set, ${firstName}!`,
              intro: customerIntro,
              booking,
              customerName,
              signoff: true,
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
