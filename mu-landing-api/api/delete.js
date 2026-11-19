// POST { id }: delete a page
import { db, guard } from "./_lib.js";

export default async function handler(req, res) {
  if (guard(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "id is required" });
  const { error } = await db.from("landing_pages").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ ok: true });
}
