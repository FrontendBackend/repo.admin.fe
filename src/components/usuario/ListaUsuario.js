import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { useConfirmDialog } from "../../context/ConfirmDialogContext";

const ListaUsuario = ({ usuarios, onDelete, onEdit, onView }) => {
  const { showConfirm } = useConfirmDialog();
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event, usuario) => {
    setAnchorEl(event.currentTarget);
    setSelectedUsuario(usuario);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUsuario(null);
  };

  const handleEliminarClick = (usuario) => {
    showConfirm({
      title: "Eliminar usuario",
      message: (
        <>
          ¿Estás seguro de eliminar a{" "}
          <strong>"{selectedUsuario.nombreUsuario}"</strong>? Esta acción no se
          puede deshacer.
        </>
      ),
      confirmText: "Eliminar",
      confirmColor: "error",
      onConfirm: () => {
        onDelete(selectedUsuario.idUsuario);
        setSelectedUsuario(usuario); // Guarda todo el usuario
        handleMenuClose();
      },
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        {usuarios.length === 0 ? (
          <Box
            sx={{
              backgroundColor: "rgb(255, 244, 229)",
              color: "rgb(102, 60, 0)",
              padding: 2,
              borderRadius: 2,
              textAlign: "center",
              marginTop: 2,
            }}
          >
            <WarningAmberIcon />
            <Typography variant="body1">
              No hay registros de usuarios disponibles.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Id del ubigeo</TableCell>
                <TableCell>Ubigeo</TableCell>
                <TableCell>Fecha de nacimiento</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.idUsuario}>
                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {usuario.nombreUsuario}
                  </TableCell>

                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {usuario.correoUsuario}
                  </TableCell>

                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {usuario.idUbigeo}
                  </TableCell>

                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {usuario.nombreUbigeo}
                  </TableCell>

                  <TableCell
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {usuario.feNacimiento
                      ? dayjs(usuario.feNacimiento).format("DD/MM/YYYY")
                      : "-"}
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Menú">
                      <IconButton onClick={(e) => handleMenuOpen(e, usuario)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    onEdit(selectedUsuario);
                    handleMenuClose();
                  }}
                >
                  <EditIcon />
                  Modificar usuario
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    onView(selectedUsuario);
                    handleMenuClose();
                  }}
                >
                  <VisibilityIcon />
                  Ver detalle usuario
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleEliminarClick(selectedUsuario);
                  }}
                >
                  <DeleteIcon />
                  Eliminar usuario
                </MenuItem>
              </Menu>
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};

export default ListaUsuario;
