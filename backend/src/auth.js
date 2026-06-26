import jwt from "jsonwebtoken";

// In einem echten Projekt käme das Secret aus einer Umgebungsvariable.
export const JWT_SECRET = process.env.JWT_SECRET || "survivadays-dev-secret-change-me";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, isAdmin: !!user.isAdmin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Erzwingt eine gültige Anmeldung (geschützte Routen: schreiben/bearbeiten/löschen/liken).
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, name: payload.name, isAdmin: !!payload.isAdmin };
    next();
  } catch {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
}

// Liest den Nutzer, falls vorhanden, blockiert aber nicht (z. B. um "hasLiked" zu liefern).
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.sub, email: payload.email, name: payload.name, isAdmin: !!payload.isAdmin };
    } catch {
      /* ungültiges Token einfach ignorieren */
    }
  }
  next();
}
