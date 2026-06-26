import { useEffect, useState, useCallback } from "react";
import {
  useParams, useNavigate, useLocation, useSearchParams, Link as RouterLink,
} from "react-router-dom";
import {
  Box, Typography, Stack, ToggleButton, ToggleButtonGroup, Button, Chip,
  CircularProgress, Alert, Snackbar, Paper, Rating,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api.js";
import { DAY_MAP } from "../data/days.js";
import { getMoodVisual } from "../data/moodVisual.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import TipCard from "../components/TipCard.jsx";
import DayBadge from "../components/DayBadge.jsx";
import MoodDialog from "../components/MoodDialog.jsx";

export default function DayDetail() {
  const { dayKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const day = DAY_MAP[dayKey];

  // The selected mood lives in the URL (?mood=...); empty means "all moods".
  const mood = searchParams.get("mood") || "";
  const moodInfo = day?.moods.find((m) => m.key === mood);

  const [tips, setTips] = useState([]);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);

  const loadTips = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { day: dayKey, sort };
      if (mood) params.mood = mood;
      const { data } = await api.get("/tips", { params });
      setTips(data);
    } catch {
      setError("Tips could not be loaded. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [dayKey, sort, mood]);

  useEffect(() => {
    loadTips();
  }, [loadTips]);

  // Reagiert auf Navigations-State: Erfolgsmeldung (flash) nach dem Speichern und
  // der Mood-Dialog (askMood) - der NUR beim Klick auf eine Tag-Karte gesetzt wird,
  // nicht bei "All" oder beim Zurückkommen vom Formular.
  useEffect(() => {
    const st = location.state;
    if (!st) return;
    if (st.flash) setToast(st.flash);
    if (st.askMood) setMoodDialogOpen(true);
    if (st.flash || st.askMood) {
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Switch the mood filter (empty string = show all moods).
  const selectMood = (moodKey) => {
    setSearchParams(moodKey ? { mood: moodKey } : {}, { replace: true });
  };

  // US 6 - Liken (sofortige Aktualisierung ohne Neuladen der Seite)
  const handleLike = async (tip) => {
    try {
      const { data } = await api.post(`/tips/${tip.id}/like`);
      setTips((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    } catch (e) {
      setToast(e.response?.data?.error || "Like failed");
    }
  };

  // US 5 - Löschen (sofort weg)
  const handleDelete = async (tip) => {
    try {
      await api.delete(`/tips/${tip.id}`);
      setTips((prev) => prev.filter((t) => t.id !== tip.id));
      setToast("Tip deleted");
    } catch (e) {
      setToast(e.response?.data?.error || "Delete failed");
    }
  };

  if (!day) {
    return <Alert severity="error">Unknown weekday.</Alert>;
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/" sx={{ mb: 2 }}>
        Back to overview
      </Button>

      {/* Header mit Tag und Motto */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderLeft: `8px solid ${day.color}` }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <DayBadge day={day} size={72} />
          <Box>
            <Typography variant="h4">{day.label}</Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              {day.motto}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Survival Level:</Typography>
              <Rating value={day.level} max={5} readOnly size="small"
                sx={{ "& .MuiRating-iconFilled": { color: day.color } }} />
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Mood-Filter: "How do you feel today?" als Chips */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 1 }}>
          How do you feel today?
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Chip
            label="All"
            onClick={() => selectMood("")}
            color={mood ? "default" : "primary"}
            variant={mood ? "outlined" : "filled"}
          />
          {day.moods.map((m) => {
            const { Icon, color } = getMoodVisual(m.score);
            const selected = m.key === mood;
            return (
              <Chip
                key={m.key}
                label={m.label}
                icon={<Icon sx={{ color: `${color} !important` }} />}
                onClick={() => selectMood(m.key)}
                variant={selected ? "filled" : "outlined"}
                sx={{
                  fontWeight: selected ? 700 : 400,
                  bgcolor: selected ? `${color}33` : "transparent",
                  borderColor: selected ? color : "rgba(255,255,255,0.2)",
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Steuerleiste: Sortierung + neuer Tipp */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <ToggleButtonGroup
          value={sort}
          exclusive
          size="small"
          onChange={(_e, v) => v && setSort(v)}
        >
          <ToggleButton value="newest">Newest first</ToggleButton>
          <ToggleButton value="popular">Most popular first</ToggleButton>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate(user ? "/tips/new" : "/login", { state: { day: dayKey, mood } })
          }
          sx={{ bgcolor: day.color, color: "#000", "&:hover": { bgcolor: day.color } }}
        >
          New tip for {day.label}
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : tips.length === 0 ? (
        <Alert severity="info">
          {moodInfo
            ? `No "${moodInfo.label}" tips for ${day.label} yet. Be the first!`
            : `No tips for ${day.label} yet. Be the first!`}
        </Alert>
      ) : (
        <Stack spacing={2}>
          {tips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              accent={day.color}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      )}

      <MoodDialog
        open={moodDialogOpen}
        day={day}
        onClose={() => setMoodDialogOpen(false)}
        onSelect={(moodKey) => {
          selectMood(moodKey);
          setMoodDialogOpen(false);
        }}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        message={toast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
