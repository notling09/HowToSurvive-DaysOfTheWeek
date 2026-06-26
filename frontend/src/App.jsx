import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import DayDetail from "./pages/DayDetail.jsx";
import TipForm from "./pages/TipForm.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ maxWidth: 1280, mx: "auto", px: 3, py: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/day/:dayKey" element={<DayDetail />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/tips/new"
            element={
              <ProtectedRoute>
                <TipForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tips/:id/edit"
            element={
              <ProtectedRoute>
                <TipForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </>
  );
}
