// POST: create a page (no id) or update a page (with id)
import { db, guard, RESERVED } from "./_lib.js";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export default async function handler(req, res) {
  if (guard(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const { id, slug, program_id, widget_id, hero_image, title, status, noindex, updated_by } = req.body || {};

  if (!slug || !SLUG.test(slug)) return res.status(400).json({ error: "Slug can only use lowercase letters, numbers and hyphens" });
  if (RESERVED.includes(slug)) return res.status(400).json({ error: "This slug is reserved" });
  if (!program_id || !widget_id) return res.status(400).json({ error: "Programme and widget are required" });
  if (status && !["draft", "published"].includes(status)) return res.status(400).json({ error: "Invalid status" });

  const row = {
    slug, program_id, widget_id,
    hero_image: hero_image || null,
    title: title || null,
    status: status || "draft",
    noindex: noindex ?? true,
    updated_by: updated_by || null,
    updated_at: new Date().toISOString(),
  };

  const query = id
    ? db.from("landing_pages").update(row).eq("id", id)
    : db.from("landing_pages").insert(row);

  const { data, error } = await query.select().single();
  if (error) {
    if (error.code === "23505") return res.status(409).json({ error: "This slug is already taken" });
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json(data);
}
