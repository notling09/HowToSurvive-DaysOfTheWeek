import {
  Dialog, DialogContent, DialogActions, Typography, Button,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import DayBadge from "./DayBadge.jsx";

// Shows a motivational quote that fits the (today's) weekday.
export default function QuoteDialog({ open, day, quote, onClose }) {
  if (!day) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderTop: `6px solid ${day.color}` } }}
    >
      <DialogContent sx={{ textAlign: "center", py: 4 }}>
        <DayBadge day={day} size={72} />
        <Typography
          variant="overline"
          sx={{ display: "block", mt: 1, color: day.color, letterSpacing: 1 }}
        >
          {day.label} motivation
        </Typography>
        <FormatQuoteIcon
          sx={{ fontSize: 40, color: day.color, opacity: 0.5, transform: "scaleX(-1)" }}
        />
        <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.5, px: 1 }}>
          {quote}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ bgcolor: day.color, color: "#000", "&:hover": { bgcolor: day.color } }}
        >
          Thanks!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
