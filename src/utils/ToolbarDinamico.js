// src/components/ToolbarUsuario.jsx
import { Box, Button, Toolbar, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ToolbarDinamico = ({
  titulo = "",
  rutaVolver = "/usuarios",
  ocultar = true,
}) => {
  const navigate = useNavigate();

  return (
    <Toolbar
      sx={{
        backgroundColor: "#eeeeee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 0,
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {ocultar && (
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(rutaVolver)}>
            Volver
          </Button>
        )}

        {titulo && (
          <Typography variant="h6" component="div" sx={{ ml: 2 }}>
            {titulo}
          </Typography>
        )}
      </Box>
    </Toolbar>
  );
};

export default ToolbarDinamico;
