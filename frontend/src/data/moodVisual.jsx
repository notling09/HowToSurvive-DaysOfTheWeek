import VeryBad from "@mui/icons-material/SentimentVeryDissatisfied";
import Bad from "@mui/icons-material/SentimentDissatisfied";
import Neutral from "@mui/icons-material/SentimentNeutral";
import Good from "@mui/icons-material/SentimentSatisfied";
import VeryGood from "@mui/icons-material/SentimentVerySatisfied";

// Maps a mood score (1 = rough ... 5 = great) to a face icon and a color,
// so moods read intuitively without using emojis.
const TABLE = {
  1: { Icon: VeryBad,  color: "#ef5350" },
  2: { Icon: Bad,      color: "#ff7043" },
  3: { Icon: Neutral,  color: "#ffca28" },
  4: { Icon: Good,     color: "#9ccc65" },
  5: { Icon: VeryGood, color: "#66bb6a" },
};

export function getMoodVisual(score) {
  return TABLE[score] || TABLE[3];
}
