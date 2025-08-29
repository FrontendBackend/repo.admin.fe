import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const DialogoPersona = ({ onCreate, openDialog, setOpenDialog, loading }) => {
  const handleNavigate = async (tipoPersona) => {
    onCreate(tipoPersona);
  };

  return (
    <>
      {/* Dialogo para agregar persona */}
      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return; // Evita que se cierre
          }
          setOpenDialog(false);
        }}
        fullWidth
      >
        <DialogTitle>Seleccionar el tipo de persona</DialogTitle>
        <DialogContent>
          <Button
            disabled={loading}
            fullWidth
            variant="contained"
            onClick={() => handleNavigate("natural")}
          >
            Persona Natural
          </Button>
          <Box sx={{ my: 1 }} />
          <Button
            fullWidth
            disabled={loading}
            variant="contained"
            onClick={() => handleNavigate("juridica")}
          >
            Persona Jurídica
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogoPersona