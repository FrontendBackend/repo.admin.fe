import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Autocomplete,
  FormControl,
  FormHelperText,
  Card,
  CardContent,
} from "@mui/material";
import debounce from "lodash.debounce";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "../../context/SnackbarContext";
import TipoResultado from "../../utils/TipoResultado";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { filtrarUbigeo } from "../../services/UbigeoServices";
import ToolbarDinamico from "../../utils/ToolbarDinamico";

const FormularioUsuario = ({
  onSubmit,
  initialData = {},
  isEdit = false,
  isReadOnly = false,
  titulo,
  ocultar = false,
}) => {
  const { showSnackbar } = useSnackbar();
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      nombreUsuario: "",
      correoUsuario: "",
      feNacimiento: null,
      idUbigeo: null,
    },
  });
  const [ubigeoOptions, setUbigeoOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Si recibes datos iniciales (edición), cargarlos
  useEffect(() => {
    if (initialData && initialData.idUbigeo && initialData.nombreUbigeo) {
      const ubigeoObj = {
        idUbigeo: initialData?.idUbigeo,
        nombreUbigeo: initialData?.nombreUbigeo,
      };

      reset({
        nombreUsuario: initialData?.nombreUsuario || "",
        correoUsuario: initialData?.correoUsuario || "",
        idUbigeo: ubigeoObj, // Aquí lo importante: le pasas el objeto completo
        feNacimiento: initialData?.feNacimiento
          ? dayjs(initialData.feNacimiento)
          : null,
      });

      setUbigeoOptions([ubigeoObj]); // También lo agregas como opción válida
    } else {
      reset({
        nombreUsuario: initialData?.nombreUsuario || "",
        correoUsuario: initialData?.correoUsuario || "",
        idUbigeo: null,
      });
    }
  }, [initialData, reset]);

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

  const onFormSubmit = async (data) => {
    setLoading(true);

    const dataFinal = {
      ...data,
      idUbigeo: data.idUbigeo ? data.idUbigeo.idUbigeo : null,
      feNacimiento: data.feNacimiento
        ? dayjs(data.feNacimiento).format("DD-MM-YYYY")
        : null,
    };

    try {
      await onSubmit(dataFinal); // Espera a que termine
      if (!isEdit) {
        reset({
          nombreUsuario: "",
          correoUsuario: "",
          idUbigeo: null,
        });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      showSnackbar({
        open: true,
        mensaje: `Error al guardar: ${error.message}`,
        severity: TipoResultado.ERROR.toString().toLowerCase(),
      });
    } finally {
      setLoading(false); // Recién aquí se activa el botón
    }
  };

  return (
    <>
      <ToolbarDinamico
        titulo={titulo ? titulo : "Gestión de formulario de usuarios"}
        ocultar={ocultar}
      />

      <Card elevation={1}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onFormSubmit)}
            sx={{ display: "flex", gap: 2, flexDirection: "column" }}
          >
            {/* Nombre */}
            <Controller
              name="nombreUsuario"
              control={control}
              rules={{ required: "Nombre es obligatorio" }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                  <TextField
                    {...field}
                    label="Nombre"
                    inputProps={{ maxLength: 100 }}
                    disabled={isReadOnly}
                    error={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Correo */}
            <Controller
              name="correoUsuario"
              control={control}
              rules={{ required: "Correo es obligatorio" }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                  <TextField
                    {...field}
                    label="Correo"
                    type="email"
                    inputProps={{ maxLength: 100 }}
                    disabled={isReadOnly}
                    error={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Ubigeo */}
            <Controller
              name="idUbigeo"
              control={control}
              rules={{ required: "Ubigeo es obligatorio" }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error}>
                  <Autocomplete
                    options={ubigeoOptions}
                    getOptionLabel={getUbigeoLabel}
                    filterOptions={(options) => options}
                    loading={loading}
                    onInputChange={(e, value) => buscarUbigeos(value)}
                    value={field.value}
                    onChange={(e, newValue) => field.onChange(newValue)}
                    disabled={isReadOnly}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ubigeo"
                        error={!!fieldState.error}
                      />
                    )}
                  />
                  {fieldState.error && (
                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

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
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    disabled={isReadOnly}
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

            {!isReadOnly && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Creando..." : isEdit ? "Modificar" : "Crear"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default FormularioUsuario;
