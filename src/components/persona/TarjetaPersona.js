import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  LinearProgress,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useConfirmDialog } from "../../context/ConfirmDialogContext";

const TarjetaPersona = ({ personas, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const { showConfirm } = useConfirmDialog();

  const handleEditar = async (persona) => {
    setLoading(true);
    onEdit(persona);
  };

  const handleEliminar = async (persona) => {
    console.log(persona);

    showConfirm({
      title: "Eliminar persona",
      message: (
        <>
          ¿Estás seguro de eliminar a <strong>"{persona.noPersona}"</strong>?
          Esta acción no se puede deshacer.
        </>
      ),
      confirmText: "Eliminar",
      confirmColor: "error",
      onConfirm: () => {
        onDelete(persona.idPersona);
      },
    });
  };

  return (
    <>
      <Box
        sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 9999 }}
      >
        {loading && <LinearProgress />}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={2}
        alignItems="start" // 👈 importante: que no estire las tarjetas
      >
        {personas.map((persona, index) => (
          <Card
            key={persona.idPersona || index}
            variant="outlined"
            sx={{
              overflow: "hidden", // evita desbordes
            }}
          >
            <CardActionArea>
              <CardHeader
                avatar={
                  <Avatar
                    src={
                      "https://a.storyblok.com/f/178900/200x200/4acc11bf54/9f73b5ce92d6191b12cbaa8ae196c4681594733184_large.jpg"
                    }
                  />
                }
                title={persona.noPersona}
                subheader={persona.deCorreo}
              />
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  Información adicional sobre {persona.noPersona}.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                size="small"
                color="primary"
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => handleEditar(persona)}
              >
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={() => handleEliminar(persona)}
              >
                Editar
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default TarjetaPersona;
