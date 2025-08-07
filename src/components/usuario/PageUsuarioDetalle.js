/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  obtenerUsuarioPorId,
  modificarUsuario,
} from "../../services/UsuarioServices";
import { Container, Box, LinearProgress } from "@mui/material";
import FormularioUsuario from "./FormularioUsuario";
import ToolbarDinamico from "../../utils/ToolbarDinamico";
import TipoResultado from "../../utils/TipoResultado";
import { useSnackbar } from "../../context/SnackbarContext";

const PageUsuarioDetalle = () => {
  const { showSnackbar } = useSnackbar();
  const { idUsuario } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isReadOnly = location.pathname.includes("/ver");
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleObtenerUsuarioPorId(idUsuario);
  }, [idUsuario]);

  /**
   * =================================================
   * Permite obtener el usuario por
   * idUsuario
   * @param {*} idUsuario
   * =================================================
   */
  const handleObtenerUsuarioPorId = async (idUsuario) => {
    try {
      const res = await obtenerUsuarioPorId(idUsuario);
      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
        setUsuario(res.data);
      }
    } catch (err) {
      console.error("Error al obtener el usuario", err);
      showSnackbar({
        open: true,
        mensaje: "Error al obtener el usuario.",
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    }
  };

  /**
   * =================================================
   * Permite obtener el usuario por
   * idUsuario
   * @param {*} idUsuario
   * =================================================
   */
  const handleEnviar = async (usuarioActualizado) => {
    try {
      setLoading(true);
      const res = await modificarUsuario(idUsuario, usuarioActualizado);

      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.SUCCESS.toString().toLowerCase(),
        });

        // Esperar un poco antes de navegar (opcional, para que se vea el mensaje)
        setTimeout(() => {
          navigate("/usuarios");
          setLoading(false);
        });
      } else if (res.tipoResultado === TipoResultado.WARNING.toString()) {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.WARNING.toString().toLowerCase(),
        });
        setLoading(false);
      } else {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      }
    } catch (err) {
      console.error("Error al editar usuario", err);
      showSnackbar({
        open: true,
        mensaje: "Error al modificar el usuario.",
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    }
  };

  if (!usuario) return <LinearProgress />;

  return (
    <Container>
      {loading && (
        <Box sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 9999, }}>
          <LinearProgress />
        </Box>
      )}

      <ToolbarDinamico titulo={isReadOnly ? "Detalle de Usuario" : "Modificar Usuario"} ocultar={true}/>

      <FormularioUsuario
        initialData={usuario}
        isEdit={!isReadOnly}
        isReadOnly={isReadOnly}
        onSubmit={handleEnviar}
      />
    </Container>
  );
};

export default PageUsuarioDetalle;
