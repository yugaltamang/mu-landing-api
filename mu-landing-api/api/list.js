// GET: all pages including drafts (for the editor table)
import { db, guard } from "./_lib.js";

export default async function handler(req, res) {
  if (guard(req, res)) return;
  const { data, error } = await db
    .from("landing_pages")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}
