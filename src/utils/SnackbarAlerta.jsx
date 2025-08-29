import { Snackbar, Alert } from "@mui/material";

const SnackbarAlerta = ({ open, mensaje, severity = "success", onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        variant="filled"
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {mensaje}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlerta;
