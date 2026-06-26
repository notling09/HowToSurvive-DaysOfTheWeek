import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardActions, Typography, Box, Avatar, IconButton,
  Button, Chip, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../auth/AuthContext.jsx";

const ADMIN_BLUE = "#42a5f5";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// Zeigt einen einzelnen Tipp (US 3) inkl. Autor-Name, Like/Unlike (US 6),
// Bearbeiten (US 4), Löschen (US 5). Der Admin-Name wird blau dargestellt.
export default function TipCard({ tip, accent, onLike, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const nameColor = tip.authorIsAdmin ? ADMIN_BLUE : "text.primary";

  return (
    <Card sx={{ borderLeft: `5px solid ${accent}` }}>
      <CardContent>
        {/* Autor über dem Kommentar (Admin = blau) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 28, height: 28, fontSize: 14, fontWeight: 700, color: "#000",
              bgcolor: tip.authorIsAdmin ? ADMIN_BLUE : accent,
            }}
          >
            {tip.authorName?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: nameColor }}>
            {tip.authorName}
          </Typography>
          {tip.authorIsAdmin && (
            <Chip label="Admin" size="small"
              sx={{ height: 18, fontSize: 11, fontWeight: 700, color: ADMIN_BLUE, borderColor: ADMIN_BLUE }}
              variant="outlined" />
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {tip.title}
          </Typography>
          {tip.hashtag && (
            <Chip label={tip.hashtag} size="small" sx={{ color: accent }} variant="outlined" />
          )}
        </Box>
        <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
          {tip.description}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, display: "block", mt: 1.5 }}>
          {formatDate(tip.createdAt)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* US 6: Liken und wieder Unliken */}
          <Tooltip title={!user ? "Log in to like" : tip.hasLiked ? "Unlike" : "Like"}>
            <span>
              <IconButton color="error" disabled={!user} onClick={() => onLike(tip)}>
                {tip.hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="body2" fontWeight={600}>
            {tip.likes}
          </Typography>
        </Box>

        {/* US 4 + 5: Bearbeiten/Löschen für eigene Tipps - der Admin darf alle */}
        {tip.canEdit && (
          <Box>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/tips/${tip.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          </Box>
        )}
      </CardActions>

      {/* US 5: Bestätigungsfrage vor dem Löschen */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete this tip?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{tip.title}" will be permanently deleted. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setConfirmOpen(false);
              onDelete(tip);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
