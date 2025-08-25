/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext";
import TipoResultado from "../../utils/TipoResultado";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Drawer,
  Fab,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  eliminarPersona,
  paginarPersona,
} from "../../services/PersonaServices";
import ToolbarDinamico from "../../utils/ToolbarDinamico";
import TarjetaPersona from "./TarjetaPersona";
import { useNavigate } from "react-router-dom";
import TipoAccion from "../../utils/TipoAccion";
import DialogoPersona from "./DialogoPersona";
import Constantes from "../../utils/Constantes";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import Paginacion from "../../utils/Paginacion";

const PageListaPersona = () => {
  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState({
    nombre: "",
    tipo: "",
  });
  const { showSnackbar } = useSnackbar();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // handleListarPersona();
    handlePaginarPersona(page, limit);
  }, [page, limit]);

  /**
   * La función `handleListarPersona` es una función asincrónica que obtiene una lista de personas,
   * gestiona diferentes tipos de resultados y muestra un mensaje de snackbar según corresponda.
   */
  // const handleListarPersona = async () => {
  //   try {
  //     setLoading(true);
  //     const data = await listarPersona();
  //     if (data.tipoResultado === TipoResultado.ERROR.toString()) {
  //       showSnackbar({
  //         open: true,
  //         mensaje: data.mensaje,
  //         severity: TipoResultado.ERROR.toString().toLowerCase(),
  //       });
  //     } else if (data.tipoResultado === TipoResultado.WARNING.toString()) {
  //       setPersonas(data.data);
  //       showSnackbar({
  //         open: true,
  //         mensaje: data.mensaje,
  //         severity: TipoResultado.WARNING.toString().toLowerCase(),
  //       });
  //     } else {
  //       setPersonas(data.data);
  //     }
  //     setLoading(false);
  //   } catch (e) {
  //     showSnackbar({
  //       open: true,
  //       mensaje: e.message,
  //       severity: TipoResultado.ERROR.toString().toLowerCase(),
  //     });
  //   }
  // };

  /**
   * La función `handlePaginarPersona` se utiliza para gestionar la paginación de una lista de personas,
   * mostrando mensajes de error si es necesario.
   * @param page - El parámetro `page` de la función `handlePaginarPersona` representa el número de página
   * del que se desean recuperar los datos. Se utiliza para especificar la página de datos que se desea
   * obtener de los resultados paginados.
   * @param limit - El parámetro `limit` de la función `handlePaginarPersona` representa el número
   * de elementos que se desean mostrar por página al paginar una lista de personas. Determina cuántos registros
   * se obtendrán y mostrarán en cada página de los resultados paginados.
   */
  const handlePaginarPersona = async (page, limit) => {
    try {
      setLoading(true);
      const data = await paginarPersona(page, limit);

      if (data.tipoResultado === TipoResultado.ERROR.toString()) {
        showSnackbar({
          open: true,
          mensaje: data.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      } else {
        setPersonas(data.data.data); // registros
        setTotal(data.data.total); // total registros
        setTotalPages(data.data.totalPages); // total páginas
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
      handlePaginarPersona(page, limit);
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
    if (idTipoDocIdentidad === Constantes.TIPOS_DOCUMENTO.RUC)
      return "juridica";
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

  /**
   * La función `handleNavgConsultarPersona` navega a una URL específica según el tipo de persona
   * y su ID.
   * @param persona - El parámetro `persona` parece ser un objeto que representa a una persona con las
   * siguientes propiedades:
   */
  const handleNavgConsultarPersona = async (persona) => {
    const tipoPersona = getTipoPersona(persona.idTipoDocIdentidad);
    navigate(
      `/personas/${TipoAccion.CONSULTAR}/${tipoPersona}/${persona.idPersona}`
    );
  };

  const handleApplyFilters = () => {
    console.log("🔎 Filtros aplicados:", filters);
    // 👇 aquí llamas tu API con filtros + paginación
    // getPersonas({ page, limit, ...filters })
    setOpenFilter(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      <Box
        sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 9999 }}
      >
        {loading && <LinearProgress />}
      </Box>

      <ToolbarDinamico
        titulo={"Gestión de formulario de personas naturales y jurídicas"}
        ocultar={false}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2} // 👈 separación entre elementos cuando están en columna
      >
        <Tooltip title="Agregar Persona" placement="top">
          <Fab
            color="primary"
            sx={{ mb: 2 }}
            onClick={() => setOpenDialog(true)}
            variant="contained"
          >
            <AddIcon />
          </Fab>
        </Tooltip>

        {/* Botón filtros */}
        <Tooltip title="Filtros avanzados" placement="top">
          <Fab
            color="secondary"
            sx={{ mb: 2 }}
            onClick={() => setOpenFilter(true)}
            variant="contained"
          >
            <FilterListIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Typography variant="caption" gutterBottom sx={{ display: "block" }}>
        Total de registros: {total}
      </Typography>

      {/* Tarjeta de listas de personas */}
      <TarjetaPersona
        personas={personas}
        onDelete={handleEliminarPersona}
        onEdit={handleNavgEditarPersona}
        onConsulta={handleNavgConsultarPersona}
      />

      {/* 📌 Paginación y cantidad de registros */}
      <Paginacion
        limit={limit}
        page={page}
        setLimit={setLimit}
        setPage={setPage}
        totalPages={totalPages}
      />

      {/* Dialogo de creación de personas */}
      <DialogoPersona
        onCreate={handleNavgCrearPersona}
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
      ></DialogoPersona>

      {/* 🔹 Drawer de filtros avanzados */}
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <Card sx={{ width: 300, height: "100%", mt: 6 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filtros Avanzados
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Nombre"
                value={filters.nombre}
                onChange={(e) =>
                  setFilters({ ...filters, nombre: e.target.value })
                }
              />
              <TextField
                label="Tipo"
                value={filters.tipo}
                onChange={(e) =>
                  setFilters({ ...filters, tipo: e.target.value })
                }
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyFilters}
              >
                Aplicar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setFilters({ nombre: "", tipo: "" })}
              >
                Limpiar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Drawer>
    </Container>
  );
};

export default PageListaPersona;
