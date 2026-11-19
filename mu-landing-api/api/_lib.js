import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const db = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

// Every real route on the website must be listed here so a landing page can't replace it
export const RESERVED = [
  "admin", "api", "assets", "about", "programmes", "programs",
  "apply", "contact", "faculty", "careers", "news",
];

export function cors(req, res) {
  const allowed = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim());
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Headers", "content-type, x-editor-password");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") { res.status(204).end(); return true; }
  return false;
}

export function passwordOk(req) {
  const given = Buffer.from(String(req.headers["x-editor-password"] || ""));
  const real = Buffer.from(String(process.env.EDITOR_PASSWORD || ""));
  if (!real.length) return false;
  return given.length === real.length && crypto.timingSafeEqual(given, real);
}

// Runs CORS + password check. Returns true if the request should stop here.
export function guard(req, res) {
  if (cors(req, res)) return true;
  if (!passwordOk(req)) { res.status(401).json({ error: "Wrong password" }); return true; }
  return false;
}
