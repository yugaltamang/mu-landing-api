// GET: programmes + widgets for the editor dropdowns
// Returns: [{ widget_id, program_id, program_name }]
import { cors } from "./_lib.js";

function normalise(list) {
  return (Array.isArray(list) ? list : list?.data || [])
    .map(w => ({
      widget_id: String(w.widget_id ?? w.widgetId ?? w.id ?? ""),
      program_id: String(w.program_id ?? w.programId ?? ""),
      program_name: String(w.program_name ?? w.programName ?? w.name ?? ""),
    }))
    .filter(w => w.widget_id && w.program_id);
}

export default async function handler(req, res) {
  if (cors(req, res)) return;

  // Until the tech team's API is ready, a static list can be set in Vercel as WIDGETS_STATIC
  if (!process.env.WIDGET_API_URL) {
    try { return res.json(normalise(JSON.parse(process.env.WIDGETS_STATIC || "[]"))); }
    catch { return res.status(500).json({ error: "WIDGETS_STATIC is not valid JSON" }); }
  }

  try {
    const r = await fetch(process.env.WIDGET_API_URL, {
      headers: { "x-api-key": process.env.WIDGET_API_KEY || "" },
    });
    if (!r.ok) return res.status(502).json({ error: `Widget API returned ${r.status}` });
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.json(normalise(await r.json()));
  } catch {
    res.status(502).json({ error: "Could not reach widget API" });
  }
}
