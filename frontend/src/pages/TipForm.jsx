import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box, Paper, Typography, TextField, MenuItem, Button, Stack,
  Alert, CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import api from "../api.js";
import { DAYS, DAY_MAP } from "../data/days.js";
import { getMoodVisual } from "../data/moodVisual.jsx";

// US 2 (erstellen) und US 4 (bearbeiten) teilen sich dasselbe Formular.
export default function TipForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    day: location.state?.day || "Mon",
    mood: location.state?.mood || "",
    hashtag: "",
  });

  // Moods available for the currently selected day.
  const dayMoods = DAY_MAP[form.day]?.moods || [];
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Beim Bearbeiten: bestehenden Tipp laden und Formular vorbefüllen.
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/tips/${id}`);
        if (!data.isOwner) {
          setServerError("You can only edit your own tips.");
          return;
        }
        setForm({
          title: data.title,
          description: data.description,
          day: data.day,
          mood: data.mood || "",
          hashtag: data.hashtag || "",
        });
      } catch {
        setServerError("Tip could not be loaded.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // Changing the day resets the mood if it no longer fits the new day.
  const handleDayChange = (e) => {
    const newDay = e.target.value;
    const stillValid = DAY_MAP[newDay]?.moods.some((m) => m.key === form.mood);
    setForm((f) => ({ ...f, day: newDay, mood: stillValid ? f.mood : "" }));
  };

  // Pflichtfeld-Prüfung (US 2: Formular prüft, ob alle Pflichtfelder ausgefüllt sind)
  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    else if (form.title.trim().length < 3) next.title = "Title is too short (min. 3 characters)";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.day) next.day = "Please select a day";
    if (!form.mood) next.mood = "Please choose a mood";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        day: form.day,
        mood: form.mood || null,
        hashtag: form.hashtag.trim() || null,
      };
      if (isEdit) {
        await api.put(`/tips/${id}`, payload);
      } else {
        await api.post("/tips", payload);
      }
      // Erfolg: zurück zur Tag-Seite, wo der neue/aktualisierte Tipp erscheint.
      navigate(`/day/${form.day}`, {
        state: { flash: isEdit ? "Tip updated" : "Tip saved" },
      });
    } catch (err) {
      setServerError(err.response?.data?.error || "Saving failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: "auto" }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? "Edit tip" : "Write a new survival tip"}
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Title"
              required
              value={form.title}
              onChange={update("title")}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
            />
            <TextField
              label="Description"
              required
              value={form.description}
              onChange={update("description")}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              minRows={4}
              fullWidth
            />
            <TextField
              label="Weekday"
              required
              select
              value={form.day}
              onChange={handleDayChange}
              error={!!errors.day}
              helperText={errors.day}
              fullWidth
            >
              {DAYS.map((d) => (
                <MenuItem key={d.key} value={d.key}>
                  <d.Icon fontSize="small" sx={{ color: d.color, mr: 1, verticalAlign: "text-bottom" }} />
                  {d.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Mood"
              required
              select
              value={form.mood}
              onChange={update("mood")}
              error={!!errors.mood}
              helperText={errors.mood || "Which feeling does this tip help with?"}
              fullWidth
            >
              {dayMoods.map((m) => {
                const { Icon, color } = getMoodVisual(m.score);
                return (
                  <MenuItem key={m.key} value={m.key}>
                    <Icon fontSize="small" sx={{ color, mr: 1, verticalAlign: "text-bottom" }} />
                    {m.label}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              label="Hashtag (optional)"
              value={form.hashtag}
              onChange={update("hashtag")}
              placeholder="#mondayrule"
              fullWidth
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                startIcon={<CloseIcon />}
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
