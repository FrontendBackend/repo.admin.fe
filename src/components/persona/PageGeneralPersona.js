/* eslint-disable react-hooks/exhaustive-deps */
import debounce from "lodash.debounce";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { filtrarUbigeo } from "../../services/UbigeoServices";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { listarTiposDocumento } from "../../services/ValorParametroServices";
import { useSnackbar } from "../../context/SnackbarContext";
import TipoResultado from "../../utils/TipoResultado";
import SaveIcon from "@mui/icons-material/Save";
import { crearPersona, modificarPersona } from "../../services/PersonaServices";
import dayjs from "dayjs";
import Constantes from "../../utils/Constantes";
import TipoAccion from "../../utils/TipoAccion";
import { personaDefaultValues } from "../../utils/FormDefaults";
import { yupResolver } from "@hookform/resolvers/yup";
import { personaSchema } from "../../schemas/PersonaSchema";

const PageGeneralPersona = ({
  tipoAccion,
  tipo,
  idPersona,
  dataPersona = {},
  onUpdatePersona
}) => {
  const modoLectura = tipoAccion === TipoAccion.CONSULTAR.toString() ? true : false;
  const modo = idPersona ? "editar" : "crear"; // Si id existe => edición, si no => creación
  const { handleSubmit, control, reset, watch } = useForm({
    resolver: yupResolver(personaSchema(tipo)),
    defaultValues: {
      ...personaDefaultValues,
      idTipoDocIdentidad:
        tipo === "juridica"
          ? Constantes.TIPOS_DOCUMENTO.RUC
          : Constantes.TIPOS_DOCUMENTO.DNI,
    },
  });
  const [ubigeoOptions, setUbigeoOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUbigeo, setLoadingUbigeo] = useState(false);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const tipoPersona = watch("idTipoDocIdentidad"); // natural o juridica
// console.log("tipo en form", tipo);
  useEffect(() => {
    if (
      (tipoAccion === TipoAccion.EDITAR.toString() ||
        tipoAccion === TipoAccion.CONSULTAR.toString()) &&
      dataPersona
    ) {
      // cargar datos de la persona a editar o consultar
      const ubigeoObj = {
        idUbigeo: dataPersona?.idUbigeo,
        descNombreUbigeo: dataPersona?.descNombreUbigeo,
      };
      reset({ ...dataPersona, idUbigeo: ubigeoObj });
    } else if (tipoAccion === TipoAccion.CREAR.toString()) {
      // limpiar el form
      reset({
        ...personaDefaultValues,
        idTipoDocIdentidad:
          tipo === "juridica"
            ? Constantes.TIPOS_DOCUMENTO.RUC
            : Constantes.TIPOS_DOCUMENTO.DNI,
      });
    }

    handleListarTiposDocumento();
  }, [idPersona, tipoAccion, dataPersona, reset]);

  const handleListarTiposDocumento = async () => {
    const respuesta = await listarTiposDocumento();
    let filtrados = respuesta.data;

    if (tipoPersona === Constantes.TIPOS_DOCUMENTO.RUC) {
      // Solo RUC
      filtrados = respuesta.data.filter(
        (doc) => doc.idValorParametro === Constantes.TIPOS_DOCUMENTO.RUC
      );
    } else {
      // DNI y Carnet de Extranjería
      filtrados = respuesta.data.filter(
        (doc) =>
          doc.idValorParametro === Constantes.TIPOS_DOCUMENTO.DNI ||
          doc.idValorParametro === Constantes.TIPOS_DOCUMENTO.CE
      );
    }

    setTiposDocumento(filtrados);
  };

  /**
   * ========================================
   * Función para obtener el label visible
   * ========================================
   * @param {*} ubigeo
   * @returns
   */
  const getUbigeoLabel = (ubigeo) => {
    if (!ubigeo) return "";
    if (ubigeo.descNombreUbigeo) return ubigeo.descNombreUbigeo;

    const partes = [
      ubigeo.departamento,
      ubigeo.provincia,
      ubigeo.distrito,
    ].filter(Boolean);
    return partes.join(", ");
  };

  /**
   * ========================================
   * Función para buscar los ubigeos
   * =========================================
   * @function buscarUbigeos
   * @param {string} filtro - El texto de búsqueda.
   * @returns {Promise<void>} Una promesa que se resuelve cuando se termina de buscar los ubigeos.
   */
  const buscarUbigeos = debounce(async (filtro) => {
    if (!filtro || filtro.length < 2) return;
    setLoadingUbigeo(true);
    try {
      const response = await filtrarUbigeo(filtro);
      setUbigeoOptions(response.data);
    } catch (error) {
      console.error("Error al buscar ubigeos", error);
    } finally {
      setLoadingUbigeo(false);
    }
  }, 500);

  /**
   * ================================================================================
   * Permite enviar los datos de la persona para su creación o edición
   * ================================================================================
   * @param {*} data
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const dataFinal = {
        ...data,
        idUbigeo: data.idUbigeo ? data.idUbigeo.idUbigeo : null,
        feNacimiento: data.feNacimiento
          ? dayjs(data.feNacimiento).format("DD-MM-YYYY")
          : null,
        cmNota: data.cmNota.replace(/\n/g, "<br>"),
      };

      if (modo === "crear") {
        const res = await crearPersona(dataFinal);

        if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
          onUpdatePersona(res.data); 
          navigate(`/personas/editar/${tipo}/${res.data.idPersona}`);
          showSnackbar({
            open: true,
            mensaje: res.mensaje,
            severity: TipoResultado.SUCCESS.toString().toLowerCase(),
          });
          setLoading(false);
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
      } else {
        // Actualizar persona existente
        const res = await modificarPersona(data.idPersona, dataFinal);

        if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
          onUpdatePersona(res.data);
          showSnackbar({
            open: true,
            mensaje: res.mensaje,
            severity: TipoResultado.SUCCESS.toString().toLowerCase(),
          });
          setLoading(false);
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
      }
    } catch (e) {
      showSnackbar({
        open: true,
        mensaje: e.message,
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    }
  };

  const onError = (errors) => {
    console.log("errores", errors);

    showSnackbar({
      open: true,
      mensaje:
        "No es posible realizar este proceso debido a que hay campos mandatorios que no han sido completados",
      severity: TipoResultado.WARNING.toString().toLowerCase(),
    });
  };

  return (
    <>
      {loading && (
        <Box
          sx={{
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
          }}
        >
          <LinearProgress />
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, onError)}
        sx={{ display: "flex", gap: 2, flexDirection: "column" }}
      >
        {/* Card de Datos Personales */}
        <Card>
          <CardContent>
            <strong>Datos personales</strong>

            <Grid
              mt={2}
              mb={2}
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Nombre */}
              {tipo === "natural" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="noPersona"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={!!fieldState.error} fullWidth>
                        <TextField
                          {...field}
                          label="Nombre completo"
                          error={!!fieldState.error}
                          disabled={modoLectura}
                        />
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {/* Apellido Paterno */}
              {tipo === "natural" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="apPaterno"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={!!fieldState.error} fullWidth>
                        <TextField
                          {...field}
                          label="Apellido Paterno"
                          error={!!fieldState.error}
                          disabled={modoLectura}
                        />
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {/* Apellido Materno */}
              {tipo === "natural" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="apMaterno"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={!!fieldState.error} fullWidth>
                        <TextField
                          {...field}
                          label="Apellido Materno"
                          error={!!fieldState.error}
                          disabled={modoLectura}
                        />
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
            </Grid>

            <Grid
              item
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Tipo de documento */}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="idTipoDocIdentidad"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl
                      error={!!fieldState.error}
                      sx={{ m: 0, minWidth: 190 }}
                      fullWidth
                    >
                      <InputLabel>Tipo de documento</InputLabel>
                      <Select
                        label="Tipo de documento"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={
                          modoLectura ||
                          ((modo === "crear" || modo === "editar") &&
                            tipo === "juridica")
                        } // 🔹 Se bloquea si es jurídica
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
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Documento Identidad */}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="coDocumentoIdentidad"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Documento de Identidad"
                        error={!!fieldState.error}
                        disabled={modoLectura}
                      />
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Fecha Nacimiento */}
              {tipo === "natural" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="feNacimiento"
                      control={control}
                      defaultValue={null}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          label="Fecha de Nacimiento"
                          format="DD/MM/YYYY"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(value) => field.onChange(value)}
                          disabled={modoLectura}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!fieldState.error,
                              helperText: fieldState.error?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              )}
              {/* Nombre prefijo persona*/}
              {tipo === "natural" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="noPrefijoPersona"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={!!fieldState.error} fullWidth>
                        <TextField
                          {...field}
                          label="Nombre prefiijo persona"
                          error={!!fieldState.error}
                          disabled={modoLectura}
                          fullWidth
                        />
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
            </Grid>

            <Grid
              mt={2}
              item
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Correo */}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="deCorreo"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Correo"
                        type="email"
                        error={!!fieldState.error}
                        disabled={modoLectura}
                      />
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Correo adicional */}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="deCorreo2"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Correo adicional"
                        type="email"
                        error={!!fieldState.error}
                        disabled={modoLectura}
                      />
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Teléfono */}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="deTelefono"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Teléfono"
                        error={!!fieldState.error}
                        disabled={modoLectura}
                        type="number"
                      />
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Teléfono adicional*/}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="deTelefono2"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Teléfono adicional"
                        error={!!fieldState.error}
                        disabled={modoLectura}
                        type="number"
                      />
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Dirección */}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="diPersona"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Dirección"
                        error={!!fieldState.error}
                        disabled={modoLectura}
                        fullWidth
                      />
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Ubigeo */}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="idUbigeo"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl
                      error={!!fieldState.error}
                      sx={{ m: 0, minWidth: 210 }}
                      fullWidth
                    >
                      <Autocomplete
                        options={ubigeoOptions }
                        getOptionLabel={getUbigeoLabel}
                        filterOptions={(options) => options}
                        loading={loadingUbigeo}
                        onInputChange={(e, value) => buscarUbigeos(value)}
                        value={field.value ?? ""}
                        onChange={(e, newValue) => field.onChange(newValue)}
                        disabled={modoLectura}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Ubigeo"
                            error={!!fieldState.error}
                          />
                        )}
                      />
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              {/* Sexo */}
              {tipo === "natural" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="tiSexo"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl
                        error={!!fieldState.error}
                        sx={{ m: 0, minWidth: 120 }}
                        fullWidth
                      >
                        <InputLabel>Género</InputLabel>
                        <Select
                          label="Género"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          disabled={modoLectura}
                        >
                          <MenuItem value="">Seleccione su género</MenuItem>
                          <MenuItem value="M">Masculino</MenuItem>
                          <MenuItem value="F">Femenino</MenuItem>
                        </Select>
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Card de Datos adicionales */}
        <Card>
          <CardContent>
            <strong>Otros datos</strong>
            <Grid
              mt={2}
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Razón social*/}
              {tipo === "juridica" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="noRazonSocial"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={!!fieldState.error} fullWidth>
                        <TextField
                          {...field}
                          label="Razón social"
                          inputProps={{ maxLength: 100 }}
                          error={!!fieldState.error}
                          disabled={modoLectura}
                          fullWidth
                        />
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {/* ¿Es consorcio?*/}
              {tipo === "juridica" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="flConsorcio"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl
                        error={!!fieldState.error}
                        sx={{ m: 0, minWidth: 120 }}
                        fullWidth
                      >
                        <InputLabel>¿Es consorcio?</InputLabel>
                        <Select
                          label="¿Es consorcio?"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          disabled={modoLectura}
                        >
                          <MenuItem value="">Seleccione</MenuItem>
                          <MenuItem value="1">Sí</MenuItem>
                          <MenuItem value="0">No</MenuItem>
                        </Select>
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {/* Nombre corto */}
              {tipo === "juridica" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="noCorto"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl error={!!fieldState.error} fullWidth>
                        <TextField
                          {...field}
                          label="Nombre corto"
                          error={!!fieldState.error}
                          disabled={modoLectura}
                          fullWidth
                        />
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
            </Grid>

            <Grid
              mt={2}
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Restricción */}
              {tipo === "juridica" && (
                <Grid xs={12} sm={6} flex={"auto"}>
                  <Controller
                    name="deRestriccion"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl
                        error={!!fieldState.error}
                        sx={{ m: 0, minWidth: 120 }}
                        fullWidth
                      >
                        <InputLabel>Restricción</InputLabel>
                        <Select
                          label="Restricción"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          disabled={modoLectura}
                        >
                          <MenuItem value="">Seleccione</MenuItem>
                          <MenuItem value="1">Sí</MenuItem>
                          <MenuItem value="0">No</MenuItem>
                        </Select>
                        {fieldState.error && (
                          <FormHelperText>
                            {fieldState.error.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {/* Comentario nota */}
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="cmNota"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Comentario nota"
                        error={!!fieldState.error}
                        multiline
                        maxRows={4}
                        value={
                          field.value
                            ? field.value.replace(/<br\s*\/?>/gi, "\n")
                            : ""
                        }
                        disabled={modoLectura}
                        fullWidth
                      />
                      {fieldState.error && (
                        <FormHelperText>
                          {fieldState.error.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {!modoLectura && (
          <Box mt={0}>
            <Button
              loadingPosition="start"
              type="submit"
              loading={loading}
              disabled={loading}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Guardar
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PageGeneralPersona;
