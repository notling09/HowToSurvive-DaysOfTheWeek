import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import "./db.js"; // initialisiert DB + Seed
import authRoutes from "./routes/auth.js";
import tipRoutes from "./routes/tips.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tips", tipRoutes);

// In Produktion liefert Express auch das gebaute React-Frontend aus, sodass
// Frontend und Backend EIN Service mit einer URL sind. Im Dev-Modus existiert
// der dist-Ordner nicht -> dann übernimmt weiterhin Vite das Frontend.
const distPath = join(__dirname, "..", "..", "frontend", "dist");
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  // Alle Nicht-API-Pfade an die React-App geben (Client-seitiges Routing).
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(join(distPath, "index.html"));
  });
}

// Einheitliche Fehlerbehandlung
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
