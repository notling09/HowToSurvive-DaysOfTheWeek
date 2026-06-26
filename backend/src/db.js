import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "..", "data.sqlite");

// Eingebautes SQLite von Node.js (node:sqlite) – keine native Kompilierung nötig.
const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// --- Schema ---------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           TEXT PRIMARY KEY,
    email        TEXT NOT NULL UNIQUE,
    name         TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    isAdmin      INTEGER NOT NULL DEFAULT 0,
    createdAt    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tips (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    day         TEXT NOT NULL,
    mood        TEXT,
    hashtag     TEXT,
    likes       INTEGER NOT NULL DEFAULT 0,
    authorId    TEXT NOT NULL,
    createdAt   TEXT NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Verhindert, dass ein Nutzer denselben Tipp mehrmals liked (US 6).
  CREATE TABLE IF NOT EXISTS tip_likes (
    tipId  TEXT NOT NULL,
    userId TEXT NOT NULL,
    PRIMARY KEY (tipId, userId),
    FOREIGN KEY (tipId)  REFERENCES tips(id)  ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// --- Seed-Daten -----------------------------------------------------------
// Damit die App nach dem ersten Start nicht leer ist, legen wir einen
// Demo-Nutzer und ein paar Survival-Tipps an.
function seed() {
  const userCount = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
  if (userCount > 0) return;

  const now = () => new Date().toISOString();
  const demoId = randomUUID();
  // Der Demo-Nutzer ist der Admin (Name "Admin", isAdmin = 1).
  db.prepare(
    "INSERT INTO users (id, email, name, passwordHash, isAdmin, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(demoId, "demo@survivadays.ch", "Admin", bcrypt.hashSync("demo1234", 10), 1, now());

  // A few general day tips (each tagged with a fitting mood).
  const seedTips = [
    { day: "Mon", mood: "stressed",    title: "Coffee first, talk later", description: "Don't talk to anyone before the first coffee. It protects everyone involved.", hashtag: "#mondayrule", likes: 12 },
    { day: "Mon", mood: "overwhelmed", title: "Lay out your outfit on Sunday", description: "One less decision on the worst morning of the week.", hashtag: "#lifehack", likes: 5 },
    { day: "Tue", mood: "unmotivated", title: "Cut your to-do list in half", description: "Tuesday is the secret Monday. Be kind to yourself.", hashtag: null, likes: 3 },
    { day: "Wed", mood: "optimistic",  title: "Celebrate hump day", description: "Wednesday = halfway done. Treat yourself to a good snack.", hashtag: "#humpday", likes: 8 },
    { day: "Thu", mood: "excited",     title: "Thursday is almost Friday", description: "Plan your weekend today, then you'll make it through.", hashtag: null, likes: 4 },
    { day: "Fri", mood: "relieved",    title: "Push important emails to Monday", description: "Nobody seriously answers emails at 4pm on a Friday.", hashtag: "#fridayfeeling", likes: 21 },
    { day: "Sat", mood: "relaxed",     title: "Leave the alarm OFF", description: "The most important survival tip of the whole week.", hashtag: null, likes: 30 },
    { day: "Sun", mood: "calm",        title: "Sunday reset", description: "Laundry, meal prep, quick tidy-up. Then the week starts more relaxed.", hashtag: null, likes: 15 },
  ];

  // At least one comment for every (day, mood) combination, so no mood is
  // ever empty in the "How do you feel today?" view.
  const moodComments = [
    // Monday
    { day: "Mon", mood: "stressed",    title: "Breathe, it's just Monday", description: "Monday can't last forever, it only feels like it. Pick one task and start there.", likes: 7 },
    { day: "Mon", mood: "overwhelmed", title: "One thing at a time", description: "Pick ONE task. The rest can wait until you've had coffee.", likes: 5 },
    { day: "Mon", mood: "tired",       title: "You got out of bed", description: "Small win: you're up. That already counts as heroic on a Monday.", likes: 9 },
    { day: "Mon", mood: "grumpy",      title: "Grumpy is allowed", description: "You're allowed to be grumpy. Just don't reply-all while you are.", likes: 6 },
    { day: "Mon", mood: "determined",  title: "Hardest task first", description: "Channel that Monday energy into the worst task first. Future-you will cheer.", likes: 4 },
    // Tuesday
    { day: "Tue", mood: "tired",       title: "Walk, don't caffeinate", description: "A 10-minute walk beats a fourth coffee for Tuesday tiredness.", likes: 3 },
    { day: "Tue", mood: "unmotivated", title: "Lower the bar", description: "'Good enough' on a Tuesday is genuinely good enough.", likes: 6 },
    { day: "Tue", mood: "meh",         title: "Coast a little", description: "Meh is a valid state. Put on a good playlist and ride it out.", likes: 2 },
    { day: "Tue", mood: "focused",     title: "Ride the focus", description: "Tuesday is the secret productivity day. Use it while it lasts.", likes: 5 },
    { day: "Tue", mood: "hopeful",     title: "You've survived worse", description: "Three days to go, and you've handled worse than this.", likes: 4 },
    // Wednesday
    { day: "Wed", mood: "drained",     title: "Refill everything", description: "Halfway there. Top up your water bottle and your patience.", likes: 4 },
    { day: "Wed", mood: "restless",    title: "Take it for a walk", description: "Restless? Turn the next call into a walking meeting.", likes: 3 },
    { day: "Wed", mood: "okay",        title: "Steady wins", description: "Okay is underrated. Steady beats spiky every single week.", likes: 5 },
    { day: "Wed", mood: "productive",  title: "Use the momentum", description: "Hump-day momentum: knock out the thing you keep avoiding.", likes: 7 },
    { day: "Wed", mood: "optimistic",  title: "Downhill from here", description: "From here it's all downhill, the good kind. Keep going.", likes: 6 },
    // Thursday
    { day: "Thu", mood: "impatient",   title: "Almost, not yet", description: "Don't start the weekend in your head before 5pm. Okay, maybe a little.", likes: 5 },
    { day: "Thu", mood: "tired",       title: "Protect tonight", description: "Pre-Friday fatigue is real. Guard your evening and sleep early.", likes: 3 },
    { day: "Thu", mood: "hopeful",     title: "One more sunrise", description: "One more morning and you're home free. Plan something nice.", likes: 6 },
    { day: "Thu", mood: "focused",     title: "Set up an easy Friday", description: "Use Thursday focus to make tomorrow-you's day easy.", likes: 4 },
    { day: "Thu", mood: "excited",     title: "Finish strong", description: "The weekend is basically waving at you. Close strong.", likes: 8 },
    // Friday
    { day: "Fri", mood: "relieved",    title: "You made it", description: "Close the laptop like you mean it. The week is done.", likes: 14 },
    { day: "Fri", mood: "excited",     title: "Don't waste it on email", description: "Friday energy is unmatched. Spend it on something fun.", likes: 11 },
    { day: "Fri", mood: "happy",       title: "Smile, it's over", description: "The hardest part of the week is behind you. Enjoy it.", likes: 9 },
    { day: "Fri", mood: "restless",    title: "Leave a little early", description: "Antsy on a Friday? Slip out 15 minutes early, nobody notices.", likes: 7 },
    { day: "Fri", mood: "celebratory", title: "Treat yourself", description: "You survived the whole week. That was the assignment. Celebrate.", likes: 13 },
    // Saturday
    { day: "Sat", mood: "lazy",        title: "Lazy is maintenance", description: "Being lazy on Saturday isn't wasting time, it's recharging.", likes: 12 },
    { day: "Sat", mood: "relaxed",     title: "Protect the calm", description: "No alarm, no agenda. Guard this feeling with your life.", likes: 15 },
    { day: "Sat", mood: "happy",       title: "Do one fun thing", description: "Do something today purely because it's fun. That's the rule.", likes: 8 },
    { day: "Sat", mood: "adventurous", title: "Say yes", description: "Say yes to the spontaneous plan. Saturdays are for stories.", likes: 6 },
    { day: "Sat", mood: "social",      title: "Text that friend", description: "Message the friend you keep meaning to. Today is the day.", likes: 5 },
    // Sunday
    { day: "Sun", mood: "anxious",     title: "Beat the Sunday scaries", description: "Write tomorrow's worries down so your brain can finally let go.", likes: 10 },
    { day: "Sun", mood: "calm",        title: "Keep it slow", description: "A calm Sunday makes for a softer Monday. Go slow.", likes: 7 },
    { day: "Sun", mood: "cozy",        title: "Cozy mode on", description: "Blanket, warm drink, zero productivity guilt. That's the whole plan.", likes: 9 },
    { day: "Sun", mood: "reflective",  title: "One good thing", description: "Look back on one good thing from this week. Just one.", likes: 6 },
    { day: "Sun", mood: "lazy",        title: "Rest is preparation", description: "Resting isn't procrastinating. Recharge for the boss fight.", likes: 8 },
  ];

  const insert = db.prepare(
    "INSERT INTO tips (id, title, description, day, mood, hashtag, likes, authorId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  let offset = 0;
  for (const t of [...seedTips, ...moodComments]) {
    // createdAt leicht gestaffelt, damit "Neueste zuerst" sinnvoll sortiert.
    const created = new Date(Date.now() - offset * 3600_000).toISOString();
    insert.run(randomUUID(), t.title, t.description, t.day, t.mood, t.hashtag ?? null, t.likes, demoId, created);
    offset++;
  }
  console.log("Seed data created (login: demo@survivadays.ch / demo1234)");
}

seed();

export default db;
