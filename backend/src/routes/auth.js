import { Router } from "express";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import db from "../db.js";
import { signToken } from "../auth.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// US 7 - Registrieren (mit Anzeigename)
router.post("/register", (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password and name are required" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  if (name.trim().length < 2) {
    return res.status(400).json({ error: "Name must be at least 2 characters" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "This email is already registered" });
  }

  const user = {
    id: randomUUID(),
    email,
    name: name.trim(),
    passwordHash: bcrypt.hashSync(password, 10),
    isAdmin: 0,
    createdAt: new Date().toISOString(),
  };
  db.prepare(
    "INSERT INTO users (id, email, name, passwordHash, isAdmin, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(user.id, user.email, user.name, user.passwordHash, user.isAdmin, user.createdAt);

  const token = signToken(user);
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, isAdmin: false },
  });
});

// US 7 - Einloggen
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Email or password is incorrect" });
  }

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, isAdmin: !!user.isAdmin },
  });
});

export default router;
