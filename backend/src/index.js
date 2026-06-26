import express from "express";
import cors from "cors";
import "./db.js"; // initialisiert DB + Seed
import authRoutes from "./routes/auth.js";
import tipRoutes from "./routes/tips.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tips", tipRoutes);

// Einheitliche Fehlerbehandlung
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
