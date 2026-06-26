import { Box } from "@mui/material";
import Lottie from "lottie-react";

// Circular accent-colored badge containing the day's animated Lottie icon
// (the "weather of the day"). Falls back to the static MUI icon if no
// animation is provided.
export default function DayBadge({ day, size = 84 }) {
  const Icon = day.Icon;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: `${day.color}22`,
        border: `2px solid ${day.color}66`,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {day.anim ? (
        <Lottie
          animationData={day.anim}
          loop
          autoplay
          style={{ width: size * 0.82, height: size * 0.82 }}
        />
      ) : (
        <Icon sx={{ fontSize: size * 0.5, color: day.color }} />
      )}
    </Box>
  );
}
