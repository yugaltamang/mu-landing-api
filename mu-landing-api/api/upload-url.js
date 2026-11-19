// POST { filename }: returns a one-time upload link for the landing-images bucket
import { db, guard } from "./_lib.js";

export default async function handler(req, res) {
  if (guard(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const name = String((req.body || {}).filename || "image")
    .toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-80);
  if (!/\.(jpe?g|png|webp|avif|gif)$/.test(name)) return res.status(400).json({ error: "Only image files are allowed" });

  const path = `${Date.now()}-${name}`;
  const { data, error } = await db.storage.from("landing-images").createSignedUploadUrl(path);
  if (error) return res.status(400).json({ error: error.message });

  const { data: pub } = db.storage.from("landing-images").getPublicUrl(path);
  res.status(200).json({ path, token: data.token, signedUrl: data.signedUrl, publicUrl: pub.publicUrl });
}
