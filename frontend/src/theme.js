import { createTheme } from "@mui/material/styles";

// Dunkles Material-Design-Theme (siehe Konzept: "dunkles Thema").
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#26c6da" },
    secondary: { main: "#ab47bc" },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    // Body: Plus Jakarta Sans. Headings: Space Grotesk (distinct, professional).
    fontFamily: '"Plus Jakarta Sans", Helvetica, Arial, sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: "-0.5px" },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
});

export default theme;
