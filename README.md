# How to Survive – Days of the Week Edition

Interaktive Webapplikation für **Modul 294** (Frontend einer interaktiven Webapplikation realisieren).
Jeder Wochentag hat seinen eigenen Charakter – Nutzer können Survival-Tipps lesen, schreiben, bearbeiten, löschen und liken.

## Tech-Stack

| Teil      | Technologie                                          |
| --------- | ---------------------------------------------------- |
| Frontend  | React 18, Vite, Material UI (Dark Theme), React Router, Axios, Lottie (lottie-react) |
| Backend   | Node.js, Express, SQLite (better-sqlite3)            |
| Auth      | JWT (jsonwebtoken) + bcryptjs                        |

## Projektstruktur

```
HowToSurvive-DaysOfTheWeek/
├── backend/      REST-API (Express + SQLite)
│   └── src/
│       ├── index.js          Express-App
│       ├── db.js             DB-Schema + Seed-Daten
│       ├── auth.js           JWT-Helfer & Middleware
│       └── routes/           auth.js, tips.js
└── frontend/     React-App (Vite)
    └── src/
        ├── pages/            Home, DayDetail, TipForm, Login
        ├── components/       Navbar, DayCard, TipCard, ProtectedRoute
        ├── auth/             AuthContext (JWT im localStorage)
        ├── data/days.js      Wochentage (Emoji, Level, Motto, Farbe)
        ├── api.js            Axios-Client
        └── theme.js          MUI Dark Theme
```

## Starten

Zwei Terminals (Backend zuerst):

```bash
# Terminal 1 – Backend (Port 3001)
cd backend
npm install
npm start

# Terminal 2 – Frontend (Port 5173)
cd frontend
npm install
npm run dev
```

Dann im Browser öffnen: **http://localhost:5173**

> Vite leitet alle `/api`-Anfragen automatisch an das Backend (Port 3001) weiter.

### Demo-Login

Beim ersten Start werden ein Demo-Nutzer und Beispiel-Tipps angelegt:

- **E-Mail:** `demo@survivadays.ch`
- **Passwort:** `demo1234`

## User Stories (umgesetzt)

| #  | Story                       | Wo                                   |
| -- | --------------------------- | ------------------------------------ |
| 1  | Wochentage anschauen        | `Home.jsx` / `DayCard.jsx`           |
| 2  | Tipp schreiben              | `TipForm.jsx` (mit Validierung)      |
| 3  | Tipps lesen & sortieren     | `DayDetail.jsx` (neueste/beliebteste)|
| 4  | Eigenen Tipp bearbeiten     | `TipForm.jsx` (vorbefüllt)           |
| 5  | Eigenen Tipp löschen        | `TipCard.jsx` (Bestätigungsdialog)   |
| 6  | Tipp liken (1× pro Nutzer)  | `TipCard.jsx` / `tip_likes`-Tabelle  |
| 7  | Registrieren & Einloggen    | `Login.jsx` (2 Tabs, JWT)            |

## REST-API

| Methode | Endpoint              | Auth | Beschreibung                       |
| ------- | --------------------- | ---- | ---------------------------------- |
| POST    | `/api/auth/register`  | –    | Registrieren                       |
| POST    | `/api/auth/login`     | –    | Einloggen                          |
| GET     | `/api/tips`           | –    | Tipps (Filter `?day=`, `?sort=`)   |
| GET     | `/api/tips/:id`       | –    | Einzelner Tipp                     |
| POST    | `/api/tips`           | ✓    | Tipp erstellen                     |
| PUT     | `/api/tips/:id`       | ✓    | Eigenen Tipp bearbeiten            |
| DELETE  | `/api/tips/:id`       | ✓    | Eigenen Tipp löschen               |
| POST    | `/api/tips/:id/like`  | ✓    | Tipp liken (nur einmal)            |

`sort` = `newest` (Standard) oder `popular`. `day` = `Mon`…`Sun`. `mood` = eine der 5 Stimmungen des Tages (optionaler Filter).

## Mood-Feature ("How do you feel today?")

Beim Öffnen eines Wochentags erscheint der Dialog **"How do you feel today?"** mit 5 zum Tag passenden Stimmungen (z. B. Montag: Stressed, Overwhelmed, Tired, Grumpy, Determined). Nach der Wahl werden die Tipps nach dieser Stimmung gefiltert; über Chips lässt sie sich wechseln oder via **All** alles anzeigen. Jede (Tag, Stimmung)-Kombination hat mindestens einen Seed-Kommentar. Neue Tipps können beim Erstellen einer Stimmung zugeordnet werden.

## Today's motivation

Auf der Startseite hat **nur die heutige Karte** (mit „Today"-Markierung) einen Button **„Today's motivation"**. Ein Klick öffnet einen Dialog mit einem zum Wochentag passenden Motivationsspruch — pro Tag mehrere, einer wird zufällig gezeigt (siehe `QUOTES` in [days.js](frontend/src/data/days.js)).

## Accounts, Namen & Admin

- Bei der **Registrierung** gibt man zuerst E-Mail + Passwort ein und im zweiten Schritt einen **Namen**. Dieser Name steht über jedem Tipp/Kommentar und oben rechts in der Navbar.
- Der **Demo-Account ist der Admin** (Name **„Admin"**, blau dargestellt). E-Mail/Passwort bleiben `demo@survivadays.ch` / `demo1234`.
- **Rechte:** normale Nutzer können nur ihre eigenen Tipps bearbeiten/löschen. Der **Admin darf alle** bearbeiten/löschen.
- **Like/Unlike:** Ein erneuter Klick auf das Herz nimmt den Like wieder zurück (1 Like pro Nutzer pro Tipp).
- Beim **Erstellen** eines Tipps ist die Stimmung (Mood) ein **Pflichtfeld**.

## Deployment (ein Service)

In Produktion liefert der Express-Server zusätzlich das gebaute React-Frontend aus
(`backend/src/index.js`), sodass Frontend + Backend **eine** URL teilen. Beispiel mit
[Render](https://render.com) → **New Web Service** (Repo verbinden):

- **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Environment Variable:** `JWT_SECRET` = (langer Zufallswert) für die Login-Sicherheit.

Hinweis: Auf kostenlosen Tarifen ist der Speicher flüchtig – die SQLite-Datenbank wird
bei Neustarts auf die Seed-Daten zurückgesetzt (für eine Demo ausreichend). Für dauerhafte
Daten bräuchte es eine persistente Disk oder eine Online-DB (z. B. PostgreSQL).

## Credits

- Animierte Wochentag-Icons: [Meteocons](https://github.com/basmilius/meteocons) von Bas Milius (MIT-Lizenz), eingebunden als Lottie-Animationen (`@meteocons/lottie`).
- Logo (HTS): eigenes Projekt-Logo, `frontend/public/logo.png`.
