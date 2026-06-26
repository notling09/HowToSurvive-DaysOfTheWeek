import { Box, Typography, Grid2 as Grid, Paper } from "@mui/material";
import { DAYS, todayKey } from "../data/days.js";
import DayCard from "../components/DayCard.jsx";

// US 1 - Alle sieben Wochentage als Cards anzeigen, heutiger Tag hervorgehoben.
export default function Home() {
  const today = todayKey();

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a3a 100%)",
        }}
      >
        <Typography variant="h3" gutterBottom>
          How to Survive the Week
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
          Every day has its own unique vibe. Pick a day of the week and discover the best survival tips for the day.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {DAYS.map((day) => (
          <Grid key={day.key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <DayCard day={day} isToday={day.key === today} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
