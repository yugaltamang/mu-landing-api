// GET: list of form widgets for the editor dropdown, returned as [{ id, name }]
// TODO: replace the fetch below with your widget provider's real endpoint and response shape.
import { cors } from "./_lib.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;

  // Fallback while the provider isn't wired up: set WIDGETS_STATIC in Vercel as
  // [{"id":"abc123","name":"UG - TBM"},{"id":"def456","name":"UG - SOB"}]
  if (!process.env.WIDGET_API_URL) {
    try { return res.json(JSON.parse(process.env.WIDGETS_STATIC || "[]")); }
    catch { return res.status(500).json({ error: "WIDGETS_STATIC is not valid JSON" }); }
  }

  const r = await fetch(process.env.WIDGET_API_URL, {
    headers: { Authorization: `Bearer ${process.env.WIDGET_API_KEY}` },
  });
  if (!r.ok) return res.status(502).json({ error: "Widget API failed" });
  const raw = await r.json();
  const list = (Array.isArray(raw) ? raw : raw.data || []).map(w => ({
    id: w.id || w.widgetId,
    name: w.name || w.title,
  }));
  res.setHeader("Cache-Control", "s-maxage=300");
  res.json(list);
}
