import { Box, Button, Card, CardContent, Collapse, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {FilterListIcon} from "@mui/icons-material/Filter"

const FiltrosAvanzadosPersonas = ({ onFiltrar }) => {
  const [open, setOpen] = useState(false);

  // useForm inicial
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      nombre: "",
      tipo: "",
    },
  });

  // Evento al enviar filtros
  const onSubmit = (data) => {
    onFiltrar(data); // 👈 Mandamos filtros al padre
  };

  return (
    <>
      <Box my={2}>
        {/* Botón de mostrar/ocultar filtros */}
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setOpen(!open)}
        >
          {open ? "Ocultar filtros" : "Filtros avanzados"}
        </Button>

        {/* Card con filtros */}
        <Collapse in={open}>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Opciones de Filtro
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Filtro por Nombre */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="nombre"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nombre"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  {/* Filtro por Tipo */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="tipo"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputLabel id="tipo-label">Tipo</InputLabel>
                          <Select
                            {...field}
                            labelId="tipo-label"
                            fullWidth
                            defaultValue=""
                          >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="NATURAL">Natural</MenuItem>
                            <MenuItem value="JURIDICA">Jurídica</MenuItem>
                          </Select>
                        </>
                      )}
                    />
                  </Grid>

                  {/* Botones */}
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => reset()}
                      >
                        Limpiar
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        Aplicar Filtros
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Collapse>
      </Box>
    </>
  );
};

export default FiltrosAvanzadosPersonas;
