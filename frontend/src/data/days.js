import BoltIcon from "@mui/icons-material/Bolt";
import CloudIcon from "@mui/icons-material/Cloud";
import WbCloudyIcon from "@mui/icons-material/WbCloudy";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import BedtimeIcon from "@mui/icons-material/Bedtime";

// Animated Lottie "weather of the day" icons (Meteocons, MIT licensed).
import monAnim from "../assets/lottie/Mon.json";
import tueAnim from "../assets/lottie/Tue.json";
import wedAnim from "../assets/lottie/Wed.json";
import thuAnim from "../assets/lottie/Thu.json";
import friAnim from "../assets/lottie/Fri.json";
import satAnim from "../assets/lottie/Sat.json";
import sunAnim from "../assets/lottie/Sun.json";

// Five fitting moods per weekday for the "How do you feel today?" picker.
// score 1 (rough) ... 5 (great) drives the mood face icon and its color.
const MOODS = {
  Mon: [
    { key: "stressed",    label: "Stressed",    score: 1 },
    { key: "overwhelmed", label: "Overwhelmed", score: 2 },
    { key: "tired",       label: "Tired",       score: 2 },
    { key: "grumpy",      label: "Grumpy",      score: 3 },
    { key: "determined",  label: "Determined",  score: 4 },
  ],
  Tue: [
    { key: "tired",       label: "Tired",       score: 2 },
    { key: "unmotivated", label: "Unmotivated", score: 2 },
    { key: "meh",         label: "Meh",         score: 3 },
    { key: "focused",     label: "Focused",     score: 4 },
    { key: "hopeful",     label: "Hopeful",     score: 4 },
  ],
  Wed: [
    { key: "drained",     label: "Drained",     score: 2 },
    { key: "restless",    label: "Restless",    score: 3 },
    { key: "okay",        label: "Okay",        score: 3 },
    { key: "productive",  label: "Productive",  score: 4 },
    { key: "optimistic",  label: "Optimistic",  score: 4 },
  ],
  Thu: [
    { key: "impatient",   label: "Impatient",   score: 3 },
    { key: "tired",       label: "Tired",       score: 2 },
    { key: "hopeful",     label: "Hopeful",     score: 4 },
    { key: "focused",     label: "Focused",     score: 4 },
    { key: "excited",     label: "Excited",     score: 5 },
  ],
  Fri: [
    { key: "relieved",    label: "Relieved",    score: 4 },
    { key: "excited",     label: "Excited",     score: 5 },
    { key: "happy",       label: "Happy",       score: 5 },
    { key: "restless",    label: "Restless",    score: 3 },
    { key: "celebratory", label: "Celebratory", score: 5 },
  ],
  Sat: [
    { key: "lazy",        label: "Lazy",        score: 3 },
    { key: "relaxed",     label: "Relaxed",     score: 5 },
    { key: "happy",       label: "Happy",       score: 5 },
    { key: "adventurous", label: "Adventurous", score: 4 },
    { key: "social",      label: "Social",      score: 4 },
  ],
  Sun: [
    { key: "anxious",     label: "Anxious",     score: 2 },
    { key: "calm",        label: "Calm",        score: 4 },
    { key: "cozy",        label: "Cozy",        score: 4 },
    { key: "reflective",  label: "Reflective",  score: 3 },
    { key: "lazy",        label: "Lazy",        score: 3 },
  ],
};

// A few motivational quotes per weekday for the "Today's motivation" button
// on the home page. A random one is shown each time.
const QUOTES = {
  Mon: [
    "New week, clean slate. You don't have to conquer it all today — just start.",
    "Mondays feel heavy because you're lifting the whole week. You're stronger than you think.",
    "The hardest part of any week is beginning it. You showed up — that's already the win.",
  ],
  Tue: [
    "Tuesday is where the week is really built. Quietly stack your small wins.",
    "No spotlight today, just steady progress. That's how big things get done.",
    "Keep the momentum going — future-you is counting on what you do right now.",
  ],
  Wed: [
    "You're over the hill. From here it's downhill, and you're picking up speed.",
    "Halfway there means halfway done. Be proud of how far you've come this week.",
    "The summit is behind you. Enjoy the view and roll forward.",
  ],
  Thu: [
    "So close you can taste Friday. Finish strong — tomorrow you celebrate.",
    "One more push. Everything you've built this week pays off now.",
    "Thursday is the final stretch. Don't slow down this close to the finish.",
  ],
  Fri: [
    "You made it through the whole week. Be proud — you earned this weekend.",
    "Close the laptop with your head high. The hard part is done.",
    "Friday is proof you can do hard things five days straight. Go enjoy it.",
  ],
  Sat: [
    "Today is yours. Rest without guilt — you've earned every minute.",
    "Slow mornings and zero alarms. This is the reward, soak it in.",
    "Do something today just because it makes you happy. That's the whole point.",
  ],
  Sun: [
    "Breathe, reflect, recharge. A calm today builds a strong tomorrow.",
    "Rest is not wasted time — it's how you get ready to win again.",
    "End the week gently. You did enough; now let yourself refill.",
  ],
};

// Every weekday has its own character: an animated "weather of the day"
// (Lottie), a small fallback icon, a survival level, a motto, an accent
// color (concept: "one accent color per weekday"), 5 moods and motivational
// quotes. The arc tells a story: storm on Monday -> sunset on Saturday ->
// night on Sunday.
export const DAYS = [
  { key: "Mon", label: "Monday",    level: 5, motto: "The final boss of the week.",        color: "#ef5350", Icon: BoltIcon,        anim: monAnim, moods: MOODS.Mon, quotes: QUOTES.Mon },
  { key: "Tue", label: "Tuesday",   level: 4, motto: "Secretly the second Monday.",        color: "#ff7043", Icon: CloudIcon,       anim: tueAnim, moods: MOODS.Tue, quotes: QUOTES.Tue },
  { key: "Wed", label: "Wednesday", level: 3, motto: "Hump day - halfway there.",          color: "#ffca28", Icon: WbCloudyIcon,    anim: wedAnim, moods: MOODS.Wed, quotes: QUOTES.Wed },
  { key: "Thu", label: "Thursday",  level: 2, motto: "Almost there, hang in there.",       color: "#66bb6a", Icon: WbTwilightIcon,  anim: thuAnim, moods: MOODS.Thu, quotes: QUOTES.Thu },
  { key: "Fri", label: "Friday",    level: 1, motto: "The light at the end of the tunnel.", color: "#26c6da", Icon: WbSunnyIcon,     anim: friAnim, moods: MOODS.Fri, quotes: QUOTES.Fri },
  { key: "Sat", label: "Saturday",  level: 0, motto: "Alarm off, life on.",                color: "#42a5f5", Icon: BeachAccessIcon,  anim: satAnim, moods: MOODS.Sat, quotes: QUOTES.Sat },
  { key: "Sun", label: "Sunday",    level: 2, motto: "Rest - but Monday is coming.",        color: "#ab47bc", Icon: BedtimeIcon,     anim: sunAnim, moods: MOODS.Sun, quotes: QUOTES.Sun },
];

export const DAY_MAP = Object.fromEntries(DAYS.map((d) => [d.key, d]));

// Returns the key of today's weekday (JS: 0 = Sunday ... 6 = Saturday).
export function todayKey() {
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return map[new Date().getDay()];
}
