import debounce from "lodash.debounce";
import ToolbarDinamico from "../../utils/ToolbarDinamico";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  cardContentClasses,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { filtrarUbigeo } from "../../services/UbigeoServices";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { listarTiposDocumento } from "../../services/ValorParametroServices";
import { useSnackbar } from "../../context/SnackbarContext";
import TipoResultado from "../../utils/TipoResultado";
import styled from "@emotion/styled";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));
const PageGeneralPersona = () => {
  const { tipo } = useParams(); // 'natural' o 'juridica'
  const { handleSubmit, control } = useForm({
    defaultValues: {
      apMaterno: "",
      apPaterno: "",
      cmNota: "",
      coDocumentoIdentidad: "",
      deCorreo: "",
      deCorreo2: "",
      deRestriccion: "",
      deTelefono: "",
      deTelefono2: "",
      diPersona: "",
      esRegistro: "",
      feNacimiento: "",
      flConsorcio: "",
      idTipoDocIdentidad: "",
      idUbigeo: "",
      noCorto: "",
      noPersona: "",
      noPrefijoPersona: "",
      noRazoSocial: "",
      tiSexo: "",
    },
  });
  const [ubigeoOptions, setUbigeoOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    handleListarTiposDocumento();
  }, []);

  const handleListarTiposDocumento = async () => {
    const respuesta = await listarTiposDocumento();
    setTiposDocumento(respuesta.data);
  };
  // fetch("/api/tipos-documento") // Cambia por tu endpoint real
  //   .then((res) => res.json())
  //   .then((data) => setTiposDocumento(data))
  //   .catch((err) => console.error("Error cargando tipos de documento:", err));

  // Función para obtener el label visible
  const getUbigeoLabel = (ubigeo) => {
    if (!ubigeo) return "";
    if (ubigeo.nombreUbigeo) return ubigeo.nombreUbigeo;

    const partes = [
      ubigeo.departamento,
      ubigeo.provincia,
      ubigeo.distrito,
    ].filter(Boolean);
    return partes.join(", ");
  };

  // Debounce para la búsqueda de ubigeos
  const buscarUbigeos = debounce(async (filtro) => {
    if (!filtro || filtro.length < 2) return;
    setLoading(true);
    try {
      const response = await filtrarUbigeo(filtro);
      setUbigeoOptions(response.data);
    } catch (error) {
      console.error("Error al buscar ubigeos", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const onSubmit = async (data) => {
    console.log(data);
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
    <Container>
      <ToolbarDinamico
        titulo={
          tipo === "natural"
            ? "Crear persona natural"
            : "Crear persona jurídica"
        }
        rutaVolver="/personas"
        ocultar={true}
      />

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, onError)}
        sx={{ display: "flex", gap: 2, flexDirection: "column" }}
      >
        <Card>
          <CardContent>
            <strong>Datos personales</strong>
            <Box sx={{ p: 1 }}></Box>

            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Apellido Paterno */}
                <Controller
                  name="apPaterno"
                  rules={{ required: "Es requerido" }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Apellido Paterno"
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Apellido Materno */}
                <Controller
                  name="apMaterno"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Apellido Materno"
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Nombre */}
                <Controller
                  name="noPersona"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Nombre completo"
                        error={!!fieldState.error}
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

            <Box sx={{ p: 1 }}></Box>

            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Tipo de documento */}
                <Controller
                  name="idTipoDocIdentidad"
                  control={control}
                  rules={{ required: "El tipo de documento es obligatorio" }}
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
                      >
                        <MenuItem value="">Seleccione</MenuItem>
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Documento Identidad */}
                <Controller
                  name="coDocumentoIdentidad"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Documento de Identidad"
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Fecha Nacimiento */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="feNacimiento"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "Fecha de nacimiento es obligatoria" }}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        label="Fecha de Nacimiento"
                        format="DD/MM/YYYY"
                        value={field.value || null}
                        onChange={(value) => field.onChange(value)}
                        // disabled={isReadOnly}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Nombre prefijo persona*/}
                <Controller
                  name="noPrefijoPersona"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Nombre prefiijo persona"
                        error={!!fieldState.error}
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

            <Grid
              mt={2}
              item
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Correo */}
                <Controller
                  name="deCorreo"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Correo"
                        type="email"
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Correo adicional */}
                <Controller
                  name="deCorreo2"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Correo adicional"
                        type="email"
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Teléfono */}
                <Controller
                  name="deTelefono"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Teléfono"
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Teléfono adicional*/}
                <Controller
                  name="deTelefono2"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Teléfono adicional"
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Dirección */}
                <Controller
                  name="diPersona"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Dirección"
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Ubigeo */}
                <Controller
                  name="idUbigeo"
                  control={control}
                  rules={{ required: "Ubigeo es obligatorio" }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      error={!!fieldState.error}
                      sx={{ m: 0, minWidth: 210 }}
                      fullWidth
                    >
                      <Autocomplete
                        options={ubigeoOptions}
                        getOptionLabel={getUbigeoLabel}
                        filterOptions={(options) => options}
                        loading={loading}
                        onInputChange={(e, value) => buscarUbigeos(value)}
                        value={field.value}
                        onChange={(e, newValue) => field.onChange(newValue)}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="tiSexo"
                  control={control}
                  rules={{ required: "El género es obligatorio" }}
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
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <strong>Otros datos</strong>
            <Box sx={{ p: 1 }}></Box>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Razón social*/}
                <Controller
                  name="noRazoSocial"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Razón social"
                        inputProps={{ maxLength: 100 }}
                        error={!!fieldState.error}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                <Controller
                  name="flConsorcio"
                  control={control}
                  rules={{ required: "El consorcio es obligatorio" }}
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

              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Nombre corto */}
                <Controller
                  name="noCorto"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Nombre corto"
                        error={!!fieldState.error}
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

            <Grid
              mt={2}
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Restricción */}
                <Controller
                  name="deRestriccion"
                  control={control}
                  rules={{ required: "Es requerido" }}
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
              <Grid xs={12} sm={6} flex={"auto"}>
                {/* Comentario nota */}
                <Controller
                  name="cmNota"
                  control={control}
                  rules={{ required: "Es requerido" }}
                  render={({ field, fieldState }) => (
                    <FormControl error={!!fieldState.error} fullWidth>
                      <TextField
                        {...field}
                        label="Comentario nota"
                        error={!!fieldState.error}
                        multiline
                        maxRows={4}
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

        {/* Aquí puedes seguir agregando todos los demás campos que mencionaste */}

        <Box mt={0}>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PageGeneralPersona;
