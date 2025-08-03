import { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const FormularioUsuario = ({
  onSubmit,
  initialData = {},
  isEdit = false,
  isReadOnly = false,
  snackbar,
}) => {
  const [usuario, setUsuario] = useState({
    nombreUsuario: "",
    correoUsuario: "",
    ...initialData,
  });

  // Sincroniza cuando se actualiza initialData
  useEffect(() => {
    setUsuario({
      nombreUsuario: "",
      correoUsuario: "",
      ...initialData,
    });
  }, [initialData]);

  // 👉 Resetear formulario cuando no sea edición
  useEffect(() => {
    if (!isReadOnly) {
      if (!isEdit) {
        setUsuario({
          nombreUsuario: "",
          correoUsuario: "",
        });
      }
    }
  }, [isEdit, isReadOnly]);

  const handleChange = (e) => {
    if (!isReadOnly) {
      setUsuario({ ...usuario, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isReadOnly) {
      onSubmit(usuario);
    }
    // Limpia los campos manualmente si no estás editando
    if (!isEdit) {
      setUsuario({
        nombreUsuario: "",
        correoUsuario: "",
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, flexDirection: "column" }}
    >
      <TextField
        label="Nombre"
        name="nombreUsuario"
        value={usuario.nombreUsuario}
        onChange={handleChange}
        inputProps={{ maxLength: 100 }}
        disabled={isReadOnly}
        required
      />
      <TextField
        label="Correo"
        name="correoUsuario"
        value={usuario.correoUsuario}
        onChange={handleChange}
        inputProps={{ maxLength: 100 }}
        type="email"
        disabled={isReadOnly}
        required
      />

      {!isReadOnly && (
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? "Modificar" : "Crear"}
        </Button>
      )}
    </Box>
  );
};

export default FormularioUsuario;
