import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Paper, Tabs, Tab, TextField, Button, Stack, Alert, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../auth/AuthContext.jsx";

// US 7 - Login (1 Schritt) und Registrierung (2 Schritte: Zugangsdaten -> Name).
export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Registrierung
  const [regStep, setRegStep] = useState(0); // 0 = E-Mail/Passwort, 1 = Name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  const changeTab = (_e, v) => {
    setTab(v);
    setRegStep(0);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  // Schritt 1 -> 2: Zugangsdaten kurz prüfen, dann zur Namenseingabe.
  const goToNameStep = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setRegStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    setBusy(true);
    try {
      await register(email, password, name.trim());
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 440, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome
        </Typography>
        <Tabs value={tab} onChange={changeTab} variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* --- Login --- */}
        {tab === 0 && (
          <Box component="form" onSubmit={handleLogin} noValidate>
            <Stack spacing={2.5}>
              <TextField label="Email" type="email" required fullWidth
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" />
              <TextField label="Password" type="password" required fullWidth
                value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" />
              <Button type="submit" variant="contained" size="large" disabled={busy}>
                {busy ? "Please wait…" : "Log in"}
              </Button>
            </Stack>
            <Alert severity="info" sx={{ mt: 3 }}>
              Demo login: <b>demo@survivadays.ch</b> / <b>demo1234</b>
            </Alert>
          </Box>
        )}

        {/* --- Register, Step 1: Zugangsdaten --- */}
        {tab === 1 && regStep === 0 && (
          <Box component="form" onSubmit={goToNameStep} noValidate>
            <Stack spacing={2.5}>
              <TextField label="Email" type="email" required fullWidth
                value={email} onChange={(e) => setEmail(e.target.value)}
                autoComplete="email" />
              <TextField label="Password" type="password" required fullWidth
                value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" helperText="At least 6 characters" />
              <Button type="submit" variant="contained" size="large">
                Next
              </Button>
            </Stack>
          </Box>
        )}

        {/* --- Register, Step 2: Name --- */}
        {tab === 1 && regStep === 1 && (
          <Box component="form" onSubmit={handleRegister} noValidate>
            <Stack spacing={2.5}>
              <Typography variant="h6">Choose a name</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: -1 }}>
                This name is shown above your tips and comments.
              </Typography>
              <TextField label="Name" required fullWidth autoFocus
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Luca" />
              <Stack direction="row" spacing={2}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => { setRegStep(0); setError(""); }} disabled={busy}>
                  Back
                </Button>
                <Button type="submit" variant="contained" size="large" disabled={busy} sx={{ flexGrow: 1 }}>
                  {busy ? "Please wait…" : "Create account"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
