import { Box, FormControl, InputLabel, MenuItem, Pagination, Select } from '@mui/material';
import React from 'react'

function Paginacion({ totalPages, setPage, page, limit, setLimit }) {
  return (
    <>
      {/* 📌 Paginación y cantidad de registros */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        flexDirection={{ xs: "column", sm: "row" }} // 👈 columna en móvil, fila en pantallas medianas+
        gap={2} // 👈 separación entre elementos cuando están en columna
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="limit-label">Registros</InputLabel>
          <Select
            labelId="limit-label"
            value={limit}
            label="Registros"
            onChange={(e) => {
              setLimit(e.target.value);
              setPage(1); // 👈 cuando cambias el tamaño, vuelve a la página 1
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}

export default Paginacion