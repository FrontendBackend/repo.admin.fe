import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || "¿Estás seguro?"}</DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "400px", // o el valor que desees
          }}
        >
          {message || "Esta acción no se puede deshacer."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
