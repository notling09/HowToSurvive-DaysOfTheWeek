import {
  Dialog, DialogTitle, DialogContent, Box, Button, Typography,
} from "@mui/material";
import { getMoodVisual } from "../data/moodVisual.jsx";

// "How do you feel today?" - shown when a user opens a weekday.
// Lets the user pick one of the day's 5 moods to filter the tips.
export default function MoodDialog({ open, day, onSelect, onClose }) {
  if (!day) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
        How do you feel today?
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
          {day.label} · pick a mood to see fitting tips
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
            mt: 2,
          }}
        >
          {day.moods.map((mood) => {
            const { Icon, color } = getMoodVisual(mood.score);
            return (
              <Button
                key={mood.key}
                onClick={() => onSelect(mood.key)}
                variant="outlined"
                sx={{
                  flexDirection: "column",
                  gap: 0.5,
                  py: 2,
                  color: "text.primary",
                  borderColor: "rgba(255,255,255,0.15)",
                  "&:hover": { borderColor: color, bgcolor: `${color}1a` },
                }}
              >
                <Icon sx={{ fontSize: 40, color }} />
                <Typography variant="body2" fontWeight={600}>
                  {mood.label}
                </Typography>
              </Button>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
