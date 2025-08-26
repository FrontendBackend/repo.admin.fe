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
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
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
import { Controller, useForm } from "react-hook-form";
import { listarTiposDocumento } from "../../services/ValorParametroServices";
import { personaDefaultValues } from "../../utils/FormDefaults";

const PageListaPersona = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [tiposDocumento, setTiposDocumento] = useState([]);

  // 👇 Estado centralizado en RHF
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      ...personaDefaultValues,
    },
  });

  const values = watch(); // 👀 observa page y limit

  useEffect(() => {
    // 🔹 Solo reacciona a cambios en paginación
    handleListarTiposDocumento();
    handlePaginarPersona();
  }, [values.page, values.limit]);

  const handlePaginarPersona = async () => {
    try {
      setLoading(true);

      const filtro = {
        nombreCompleto: values.nombreCompleto,
        idTipoDocIdentidad: values.idTipoDocIdentidad,
      };

      const paginador = {
        page: values.page,
        limit: values.limit,
        sort: "per.id_persona DESC", // puedes ajustarlo
      };
      console.log("paginador", paginador);

      const data = await paginarPersona(filtro, paginador);

      if (data.tipoResultado === TipoResultado.ERROR.toString()) {
        showSnackbar({
          open: true,
          mensaje: data.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      } else {
        setPersonas(data.data.data);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages);
      }
    } catch (e) {
      showSnackbar({
        open: true,
        mensaje: e.message,
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavgCrearPersona = (tipo) => {
    setLoading(true);
    navigate(`/personas/${TipoAccion.CREAR}/${tipo}`);
  };

  const handleEliminarPersona = async (idPersona) => {
    try {
      setLoading(true);
      const res = await eliminarPersona(idPersona);
      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: "success",
        });
      } else {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: "error",
        });
      }
      handlePaginarPersona();
    } catch (e) {
      showSnackbar({
        open: true,
        mensaje: e.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavgEditarPersona = (persona) => {
    const tipoPersona =
      persona.idTipoDocIdentidad === Constantes.TIPOS_DOCUMENTO.RUC
        ? "juridica"
        : "natural";
    navigate(
      `/personas/${TipoAccion.EDITAR}/${tipoPersona}/${persona.idPersona}`
    );
  };

  const handleNavgConsultarPersona = (persona) => {
    const tipoPersona =
      persona.idTipoDocIdentidad === Constantes.TIPOS_DOCUMENTO.RUC
        ? "juridica"
        : "natural";
    navigate(
      `/personas/${TipoAccion.CONSULTAR}/${tipoPersona}/${persona.idPersona}`
    );
  };

  // 🔹 Se ejecuta solo cuando el usuario hace click en "Aplicar"
  const handleApplyFilters = (data) => {
    console.log("datos filtrados avanzados", data);
    handlePaginarPersona();
    setOpenFilter(false);
  };

  const limpiarFiltrosAvanzado = () => {
    reset();
  };

  const handleListarTiposDocumento = async () => {
    const respuesta = await listarTiposDocumento();
    let filtrados = respuesta.data;
    setTiposDocumento(filtrados);
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
        gap={2}
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

      <TarjetaPersona
        personas={personas}
        onDelete={handleEliminarPersona}
        onEdit={handleNavgEditarPersona}
        onConsulta={handleNavgConsultarPersona}
      />

      {/* 📌 Paginación controlada por RHF */}
      <Paginacion control={control} totalPages={totalPages} />

      <DialogoPersona
        onCreate={handleNavgCrearPersona}
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
      />

      {/* 🔹 Drawer de filtros */}
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <Card
          sx={{
            width: 300,
            height: "100%",
            mt: 6,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ flex: 1, overflowY: "auto" }}>
            <Typography variant="h8" gutterBottom>
              Filtros Avanzados
            </Typography>

            <Stack
              sx={{ mt: 2 }}
              spacing={2}
              component="form"
              onSubmit={handleSubmit(handleApplyFilters)}
            >
              <Controller
                name="nombreCompleto"
                control={control}
                render={({ field }) => (
                  <FormControl sx={{ m: 0, minWidth: 190 }} fullWidth>
                    <TextField label="Nombres y apellidos" {...field} />
                  </FormControl>
                )}
              />

              <Controller
                name="idTipoDocIdentidad"
                control={control}
                render={({ field }) => (
                  <FormControl sx={{ m: 0, minWidth: 190 }} fullWidth>
                    <InputLabel>Tipo de documento</InputLabel>
                    <Select
                      label="Tipo de documento"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {tiposDocumento.map((tipo) => (
                        <MenuItem
                          key={tipo.idValorParametro}
                          value={tipo.idValorParametro}
                        >
                          {tipo.noValorParametro}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Button type="submit" variant="contained" color="primary">
                Aplicar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => limpiarFiltrosAvanzado()}
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
