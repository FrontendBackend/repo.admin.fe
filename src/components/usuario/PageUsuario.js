import { useState, useEffect } from "react";
import { Box, Container, LinearProgress } from "@mui/material";
import {
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
} from "../../services/UsuarioServices";
import FormularioUsuario from "./FormularioUsuario";
import ListaUsuario from "./ListaUsuario";
import TipoResultado from "../../utils/TipoResultado";
import { useNavigate } from "react-router-dom";
import SnackbarAlerta from "../../utils/SnackbarAlerta";
import ToolbarDinamico from "../../utils/ToolbarDinamico";

const PageUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    severity: "success",
  });
  const navigate = useNavigate();

  /**
   * =================================================
   * Permite listar los usuarios
   * =================================================
   */
  const handleListarUsuario = async () => {
    try {
      setLoading(true);
      const data = await listarUsuarios();
      if (data.tipoResultado === TipoResultado.ERROR.toString()) {
        setSnackbar({
          open: true,
          mensaje: data.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      } else if (data.tipoResultado === TipoResultado.WARNING.toString()) {
        setUsuarios(data.data);
        setSnackbar({
          open: true,
          mensaje: data.mensaje,
          severity: TipoResultado.WARNING.toString().toLowerCase(),
        });
      } else {
        setUsuarios(data.data);
      }
      setLoading(false);
    } catch (e) {
      setSnackbar({
        open: true,
        mensaje: e.message,
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    }
  };

  /**
   * =================================================
   * Permite crear o modificar el usuario
   * @param {*} usuario
   * =================================================
   */
  const handleCrearModificarUsuario = async (usuario) => {
    try {
      setLoading(true);
      const res = await crearUsuario(usuario);

      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
        setSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.SUCCESS.toString().toLowerCase(),
        });
        setLoading(false);
      } else if (res.tipoResultado === TipoResultado.WARNING.toString()) {
        setSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.WARNING.toString().toLowerCase(),
        });
        setLoading(false);
      } else {
        setSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      }
      setSelectedUsuario(null);
      handleListarUsuario();
    } catch (e) {
      setSnackbar({
        open: true,
        mensaje: e.message,
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    }
  };

  /**
   * =================================================
   * Permite eliminar el usuario por su idUsuario
   * @param {*} idUsuario
   * =================================================
   */
  const handleEliminarUsuario = async (idUsuario) => {
    try {
      setLoading(true);
      const res = await eliminarUsuario(idUsuario);
      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
        setSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.SUCCESS.toString().toLowerCase(),
        });
        setLoading(false);
      } else {
        setSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      }
      handleListarUsuario();
    } catch (e) {
      setSnackbar({
        open: true,
        mensaje: e.message,
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    }
  };

  useEffect(() => {
    handleListarUsuario();
  }, []);

  return (
    <Container>
      <Box sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 9999 }}>
        {loading && <LinearProgress />}
      </Box>

      <ToolbarDinamico titulo="Gestión de usuarios" ocultar={false} />
      <FormularioUsuario
        onSubmit={handleCrearModificarUsuario}
        initialData={selectedUsuario}
      />
      <br />
      <ListaUsuario
        usuarios={usuarios}
        onDelete={handleEliminarUsuario}
        onView={(usuario) => navigate(`/usuarios/ver/${usuario.idUsuario}`)}
      />

      <SnackbarAlerta
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Container>
  );
};

export default PageUsuario;
