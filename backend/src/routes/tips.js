import { Router } from "express";
import { randomUUID } from "node:crypto";
import db from "../db.js";
import { requireAuth, optionalAuth } from "../auth.js";

const router = Router();

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Reichert einen Tipp mit Anzeige-Infos an: Autor-Name/-Rolle, ob der aktuelle
// Nutzer Besitzer ist, ob er bearbeiten darf (Besitzer ODER Admin) und ob er
// den Tipp bereits geliked hat.
function decorate(tip, user) {
  const author = db
    .prepare("SELECT name, isAdmin FROM users WHERE id = ?")
    .get(tip.authorId);

  let hasLiked = false;
  if (user?.id) {
    hasLiked = !!db
      .prepare("SELECT 1 FROM tip_likes WHERE tipId = ? AND userId = ?")
      .get(tip.id, user.id);
  }

  const isOwner = user?.id === tip.authorId;
  return {
    ...tip,
    authorName: author?.name || "Unknown",
    authorIsAdmin: !!author?.isAdmin,
    isOwner,
    canEdit: isOwner || !!user?.isAdmin,
    hasLiked,
  };
}

// US 3 - Tipps lesen, nach Tag + Stimmung filtern und sortieren
router.get("/", optionalAuth, (req, res) => {
  const { day, mood, sort } = req.query;
  const where = [];
  const params = [];
  if (day) {
    if (!DAYS.includes(day)) {
      return res.status(400).json({ error: "Invalid weekday" });
    }
    where.push("day = ?");
    params.push(day);
  }
  if (mood) {
    where.push("mood = ?");
    params.push(mood);
  }
  const orderBy =
    sort === "popular" ? "likes DESC, createdAt DESC" : "createdAt DESC";

  const sql = `SELECT * FROM tips ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY ${orderBy}`;
  const tips = db.prepare(sql).all(...params);
  res.json(tips.map((t) => decorate(t, req.user)));
});

// Read - einzelner Tipp
router.get("/:id", optionalAuth, (req, res) => {
  const tip = db.prepare("SELECT * FROM tips WHERE id = ?").get(req.params.id);
  if (!tip) return res.status(404).json({ error: "Tip not found" });
  res.json(decorate(tip, req.user));
});

// US 2 - Create (geschützt)
router.post("/", requireAuth, (req, res) => {
  const { title, description, day, mood, hashtag } = req.body || {};
  if (!title || !description || !day) {
    return res
      .status(400)
      .json({ error: "Title, description and day are required" });
  }
  if (!DAYS.includes(day)) {
    return res.status(400).json({ error: "Invalid weekday" });
  }

  const tip = {
    id: randomUUID(),
    title: title.trim(),
    description: description.trim(),
    day,
    mood: mood?.trim() || null,
    hashtag: hashtag?.trim() || null,
    likes: 0,
    authorId: req.user.id,
    createdAt: new Date().toISOString(),
  };
  db.prepare(
    "INSERT INTO tips (id, title, description, day, mood, hashtag, likes, authorId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    tip.id, tip.title, tip.description, tip.day, tip.mood, tip.hashtag, tip.likes, tip.authorId, tip.createdAt
  );
  res.status(201).json(decorate(tip, req.user));
});

// US 4 - Update (nur eigene Tipps)
router.put("/:id", requireAuth, (req, res) => {
  const tip = db.prepare("SELECT * FROM tips WHERE id = ?").get(req.params.id);
  if (!tip) return res.status(404).json({ error: "Tip not found" });
  // Eigene Tipps darf jeder bearbeiten, der Admin darf alle.
  if (tip.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: "You can only edit your own tips" });
  }

  const { title, description, day, mood, hashtag } = req.body || {};
  if (!title || !description || !day) {
    return res
      .status(400)
      .json({ error: "Title, description and day are required" });
  }
  if (!DAYS.includes(day)) {
    return res.status(400).json({ error: "Invalid weekday" });
  }

  db.prepare(
    "UPDATE tips SET title = ?, description = ?, day = ?, mood = ?, hashtag = ? WHERE id = ?"
  ).run(title.trim(), description.trim(), day, mood?.trim() || null, hashtag?.trim() || null, tip.id);

  const updated = db.prepare("SELECT * FROM tips WHERE id = ?").get(tip.id);
  res.json(decorate(updated, req.user));
});

// US 5 - Delete (nur eigene Tipps)
router.delete("/:id", requireAuth, (req, res) => {
  const tip = db.prepare("SELECT * FROM tips WHERE id = ?").get(req.params.id);
  if (!tip) return res.status(404).json({ error: "Tip not found" });
  // Eigene Tipps darf jeder löschen, der Admin darf alle.
  if (tip.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: "You can only delete your own tips" });
  }
  db.prepare("DELETE FROM tips WHERE id = ?").run(tip.id);
  res.status(204).end();
});

// US 6 - Liken/Unliken (geschützt). Ein zweiter Klick nimmt den Like zurück.
router.post("/:id/like", requireAuth, (req, res) => {
  const tip = db.prepare("SELECT * FROM tips WHERE id = ?").get(req.params.id);
  if (!tip) return res.status(404).json({ error: "Tip not found" });

  const already = db
    .prepare("SELECT 1 FROM tip_likes WHERE tipId = ? AND userId = ?")
    .get(tip.id, req.user.id);

  db.exec("BEGIN");
  try {
    if (already) {
      // Like zurücknehmen
      db.prepare("DELETE FROM tip_likes WHERE tipId = ? AND userId = ?").run(tip.id, req.user.id);
      db.prepare("UPDATE tips SET likes = likes - 1 WHERE id = ?").run(tip.id);
    } else {
      // Like setzen
      db.prepare("INSERT INTO tip_likes (tipId, userId) VALUES (?, ?)").run(tip.id, req.user.id);
      db.prepare("UPDATE tips SET likes = likes + 1 WHERE id = ?").run(tip.id);
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }

  const updated = db.prepare("SELECT * FROM tips WHERE id = ?").get(tip.id);
  res.json(decorate(updated, req.user));
});

export default router;
