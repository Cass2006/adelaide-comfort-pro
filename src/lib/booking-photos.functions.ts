import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const uploadInput = z
  .object({
    name: z.string().min(1).max(200),
    contentType: z
      .string()
      .regex(/^image\/(png|jpe?g|webp|gif|heic|heif)$/i, "Unsupported image type"),
    // base64 (no data URL prefix) — limit ~8MB decoded (~10.7M base64 chars)
    dataBase64: z.string().min(4).max(11_000_000),
  })
  .strict();

export const uploadBookingPhoto = createServerFn({ method: "POST" })
  .inputValidator((data) => uploadInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const bytes = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
    if (bytes.byteLength > 8 * 1024 * 1024) {
      throw new Response("File too large", { status: 413 });
    }

    const safeName = data.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
    const path = `${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("booking-photos")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (uploadError) throw new Response(uploadError.message, { status: 500 });

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("booking-photos")
      .createSignedUrl(path, 60 * 60 * 24 * 365);
    if (signError || !signed) throw new Response(signError?.message ?? "Sign failed", { status: 500 });

    return { path, signedUrl: signed.signedUrl };
  });