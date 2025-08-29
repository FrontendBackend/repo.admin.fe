import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
function Paginacion({ control, totalPages }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={3}
      flexDirection={{ xs: "column", sm: "row" }}
      gap={2}
    >
      {/* 📌 Paginación controlada por react-hook-form */}
      <Controller
        name="page"
        control={control}
        render={({ field }) => (
          <Pagination
            count={totalPages}
            page={field.value}
            onChange={(e, value) => field.onChange(value)}
            color="primary"
          />
        )}
      />

      {/* 📌 Selector de registros */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="limit-label">Registros</InputLabel>
        <Controller
          name="limit"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              labelId="limit-label"
              label="Registros"
              onChange={(e) => {
                // console.log(control);
                
                field.onChange(e.target.value);
                // 👇 cada vez que cambie limit, vuelve a la página 1
                control._formValues.page = 1;
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
}

export default Paginacion;
