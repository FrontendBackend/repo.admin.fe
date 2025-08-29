import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Aceptar",
  confirmColor = "primary",
  showCancelButton = true,
  showConfirmButton = true,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || "¿Estás seguro?"}</DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "400px",
          }}
        >
          {message || "Esta acción no se puede deshacer."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {showCancelButton && <Button onClick={onClose}>Cancelar</Button>}
        {showConfirmButton && (
          <Button onClick={onConfirm} color={confirmColor} variant="contained">
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
