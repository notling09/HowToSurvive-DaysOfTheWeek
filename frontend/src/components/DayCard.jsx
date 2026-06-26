import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardActionArea, CardContent, CardActions, Button, Typography, Box, Chip, Rating,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DayBadge from "./DayBadge.jsx";
import QuoteDialog from "./QuoteDialog.jsx";

// Eine Wochentag-Card für die Startseite (US 1).
export default function DayCard({ day, isToday }) {
  const navigate = useNavigate();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quote, setQuote] = useState("");

  // Zeigt einen zufälligen Motivationsspruch des Tages.
  const showQuote = (e) => {
    e.stopPropagation();
    const qs = day.quotes;
    setQuote(qs[Math.floor(Math.random() * qs.length)]);
    setQuoteOpen(true);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderTop: `6px solid ${day.color}`,
        outline: isToday ? `2px solid ${day.color}` : "none",
        boxShadow: isToday ? `0 0 20px ${day.color}66` : undefined,
        transition: "transform .15s ease, box-shadow .15s ease",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/day/${day.key}`, { state: { askMood: true } })}
        sx={{ flexGrow: 1 }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" fontWeight={700}>
              {day.label}
            </Typography>
            {isToday && (
              <Chip label="Today" size="small" sx={{ bgcolor: day.color, color: "#000", fontWeight: 700 }} />
            )}
          </Box>

          <Box sx={{ my: 1.5 }}>
            <DayBadge day={day} size={84} />
          </Box>

          <Typography variant="body2" sx={{ opacity: 0.85, minHeight: 40 }}>
            {day.motto}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
            <WarningAmberIcon fontSize="small" sx={{ color: day.color }} />
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Survival Level
            </Typography>
            <Rating
              value={day.level}
              max={5}
              readOnly
              size="small"
              sx={{ ml: "auto", "& .MuiRating-iconFilled": { color: day.color } }}
            />
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Nur am heutigen Tag: Button für einen Motivationsspruch */}
      {isToday && (
        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AutoAwesomeIcon />}
            onClick={showQuote}
            sx={{
              color: day.color,
              borderColor: `${day.color}66`,
              "&:hover": { borderColor: day.color, bgcolor: `${day.color}1a` },
            }}
          >
            Today's motivation
          </Button>
        </CardActions>
      )}

      <QuoteDialog
        open={quoteOpen}
        day={day}
        quote={quote}
        onClose={() => setQuoteOpen(false)}
      />
    </Card>
  );
}
