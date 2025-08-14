/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext";
import TipoResultado from "../../utils/TipoResultado";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from "@mui/material";
import { listarPersona } from "../../services/PersonaServices";
import ToolbarDinamico from "../../utils/ToolbarDinamico";
import TarjetaPersona from "./TarjetaPersona";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";

const PageListaPersona = () => {
  const { showSnackbar } = useSnackbar();
  const [personas, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    handleListarPersona();
  }, []);

  const handleListarPersona = async () => {
    try {
      setLoading(true);
      const data = await listarPersona();
      if (data.tipoResultado === TipoResultado.ERROR.toString()) {
        showSnackbar({
          open: true,
          mensaje: data.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      } else if (data.tipoResultado === TipoResultado.WARNING.toString()) {
        setUsuarios(data.data);
        showSnackbar({
          open: true,
          mensaje: data.mensaje,
          severity: TipoResultado.WARNING.toString().toLowerCase(),
        });
      } else {
        setUsuarios(data.data);
      }
      setLoading(false);
    } catch (e) {
      showSnackbar({
        open: true,
        mensaje: e.message,
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    }
  };

  const handleNavigate = (tipo) => {
    navigate(`/personas/crear/${tipo}`);
  };
  
  return (
    <Container>
      <Box
        sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 9999 }}
      >
        {loading && <LinearProgress />}
      </Box>

      <ToolbarDinamico
        titulo={"Gestión de formulario de personas naturales y jurídicas"}
        ocultar={false}
      />

      <Button
        // onClick={() => {
        //   navigate("/personas/crearPersonaNatural");
        // }}
        onClick={() => setOpenDialog(true)}
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
      >
        Agregar
      </Button>

      <Box sx={{ p: 1 }} />

      {/* Tarjeta de listas de personas */}
      <TarjetaPersona personas={personas} />

      {/* Dialogo para agregar persona */}
      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return; // Evita que se cierre
          }
          setOpenDialog(false);
        }}
        fullWidth
      >
        <DialogTitle>Seleccionar persona natural o jrídica</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNavigate("natural")}
          >
            Persona Natural
          </Button>
          <Box sx={{ my: 1 }} />
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNavigate("juridica")}
          >
            Persona Jurídica
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PageListaPersona;
