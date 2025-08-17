/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext";
import TipoResultado from "../../utils/TipoResultado";
import {
  Box,
  Button,
  Container,
  LinearProgress,
} from "@mui/material";
import { eliminarPersona, listarPersona } from "../../services/PersonaServices";
import ToolbarDinamico from "../../utils/ToolbarDinamico";
import TarjetaPersona from "./TarjetaPersona";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import TipoAccion from "../../utils/TipoAccion";
import DialogoPersona from "./DialogoPersona";
import Constantes from "../../utils/Constantes";

const PageListaPersona = () => {
  const { showSnackbar } = useSnackbar();
  const [personas, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    handleListarPersona();
  }, []);

  /**
   * La función `handleListarPersona` es una función asincrónica que obtiene una lista de personas,
   * gestiona diferentes tipos de resultados y muestra un mensaje de snackbar según corresponda.
   */
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

  /**
   * La función `handleNavgCrearPersona` establece la carga como verdadera y navega a una
   * URL específica según el parámetro tipo proporcionado.
   * @param tipo: El parámetro `tipo` de la función `handleNavgCrearPersona` es una variable que representa
   * el tipo de persona que se creará. Se utiliza para construir la URL para navegar a la página
   * de creación de la persona con el tipo especificado.
   */
  const handleNavgCrearPersona = (tipo) => {
    setLoading(true);
    navigate(`/personas/${TipoAccion.CREAR}/${tipo}`);
  };

  /**
   * La función `handleEliminarPersona` es una función asíncrona que gestiona la eliminación de una
   * persona llamando a un punto final de la API y mostrando un mensaje según el resultado.
   * @param idPersona - La función `handleEliminarPersona` es una función asíncrona que toma `idPersona` como parámetro.
   * @Dentro de la función, registra el valor de `idPersona`, establece la carga como `true`
   * y luego llama a la función `eliminarPersona` para eliminar a una persona con el `idPersona` especificado.
   */
  const handleEliminarPersona = async (idPersona) => {
    console.log("idPersona:", idPersona);

    try {
      setLoading(true);
      const res = await eliminarPersona(idPersona);
      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.SUCCESS.toString().toLowerCase(),
        });
        setLoading(false);
      } else {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      }
      handleListarPersona();
    } catch (e) {
      showSnackbar({
        open: true,
        mensaje: e.message,
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    }
  };

  /**
   * La función `getTipoPersona` determina el tipo de persona según el tipo de documento de identificación proporcionado.
   * @param idTipoDocIdentidad - El parámetro `idTipoDocIdentidad` se utiliza para determinar el tipo de
   * persona según su documento de identificación.
   * Si `idTipoDocIdentidad` es igual a 2, indica una persona jurídica. De lo contrario, indica una persona natural.
   * @returns La función `getTipoPersona` devuelve `juridica` si `idTipoDocIdentidad` es 2, o `natural` para
   * cualquier otro valor de `idTipoDocIdentidad`.
   */
  const getTipoPersona = (idTipoDocIdentidad) => {
    if (idTipoDocIdentidad === Constantes.TIPOS_DOCUMENTO.RUC) return "juridica";
    return "natural";
  };

  /**
   * La función `handleEditarPersona` navega a una página de edición para una persona específica según su
   * tipo de documento de identidad e identificación.
   * @param persona: el parámetro `persona` es un objeto que representa a una persona y probablemente contiene
   * propiedades como `idTipoDocIdentidad` e `idPersona`.
   */
  const handleNavgEditarPersona = async (persona) => {
    const tipoPersona = getTipoPersona(persona.idTipoDocIdentidad);
    navigate(
      `/personas/${TipoAccion.EDITAR}/${tipoPersona}/${persona.idPersona}`
    );
  };

  const handleNavgConsultarPersona = async (persona) => {
    const tipoPersona = getTipoPersona(persona.idTipoDocIdentidad);
    navigate(
      `/personas/${TipoAccion.CONSULTAR}/${tipoPersona}/${persona.idPersona}`
    );
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
        sx={{ mb: 2 }}
        onClick={() => setOpenDialog(true)}
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
      >
        Agregar
      </Button>

      {/* Tarjeta de listas de personas */}
      <TarjetaPersona
        personas={personas}
        onDelete={handleEliminarPersona}
        onEdit={handleNavgEditarPersona}
        onConsulta={handleNavgConsultarPersona}
      />

      <DialogoPersona
        onCreate={handleNavgCrearPersona}
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
      ></DialogoPersona>
    </Container>
  );
};

export default PageListaPersona;
