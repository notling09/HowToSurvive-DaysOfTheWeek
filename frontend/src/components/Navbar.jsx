import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Button, Box, Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "../auth/AuthContext.jsx";

// Warm orange-to-red gradient matching the HTS logo.
const BRAND_GRADIENT = "linear-gradient(90deg, #ffb300 0%, #ff6f00 45%, #e53935 100%)";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "#000", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <Toolbar sx={{ maxWidth: 1280, width: "100%", mx: "auto" }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexGrow: 1,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {/* HTS logo from public/logo.png; falls back to text if the file is missing. */}
          {logoError ? (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: BRAND_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              How to Survive
            </Typography>
          ) : (
            <Box
              component="img"
              src="/logo.png"
              alt="How to Survive"
              onError={() => setLogoError(true)}
              sx={{ height: 46, width: "auto", display: "block" }}
            />
          )}
          <Typography
            component="span"
            variant="body2"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.3,
              background: BRAND_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Days of the Week Edition
          </Typography>
        </Box>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              component={RouterLink}
              to="/tips/new"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Write tip
            </Button>
            <Chip
              label={user.name || user.email}
              variant="outlined"
              sx={user.isAdmin ? { color: "#42a5f5", borderColor: "#42a5f5", fontWeight: 700 } : undefined}
            />
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
