// src/components/ToolbarUsuario.jsx
import {
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ToolbarDinamico = ({
  titulo = "",
  rutaVolver = "/usuarios",
  ocultar = true,
}) => {
  const navigate = useNavigate();
  const theme = useTheme(); // ← Obtiene el tema actual (light/dark)
  return (
    <Toolbar
      sx={(theme) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#eeeeee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 0,
        mb: 2,
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {ocultar && (
          <IconButton
            onClick={() => navigate(rutaVolver)}
            sx={{
              color: theme.palette.text.primary, // ajusta color del texto según el tema
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {titulo && (
          <Typography
            variant="h6"
            component="div"
            sx={{
              ml: 2,
              color: theme.palette.text.primary, // color del texto adaptado
            }}
          >
            {titulo}
          </Typography>
        )}
      </Box>
    </Toolbar>
  );
};

export default ToolbarDinamico;
