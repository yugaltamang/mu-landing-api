// GET ?slug=...: is this slug free? (no password needed, read-only)
import { db, cors, RESERVED } from "./_lib.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  const slug = String(req.query.slug || "").toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return res.json({ status: "invalid" });
  if (RESERVED.includes(slug)) return res.json({ status: "reserved" });
  const { data } = await db.from("landing_pages").select("id").eq("slug", slug).maybeSingle();
  res.json({ status: data ? "taken" : "free", id: data?.id || null });
}
