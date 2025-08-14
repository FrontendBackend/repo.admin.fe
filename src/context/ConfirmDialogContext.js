// src/context/ConfirmDialogContext.js
import { createContext, useContext, useState } from "react";
import ConfirmDialog from "../utils/ConfirmDialog";

const ConfirmDialogContext = createContext();

export const useConfirmDialog = () => useContext(ConfirmDialogContext);

export const ConfirmDialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Aceptar",
    confirmColor: "primary",
    showConfirmButton: true,
    showCancelButton: true,
    onConfirm: () => {},
  });

  const showConfirm = ({
    title,
    message,
    confirmText,
    confirmColor,
    showConfirmButton = true,
    showCancelButton = true,
    onConfirm,
  }) => {
    setDialogState({
      open: true,
      title,
      message,
      confirmText: confirmText || "Aceptar",
      confirmColor: confirmColor || "primary",
      showConfirmButton,
      showCancelButton,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setDialogState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const closeConfirm = () =>
    setDialogState((prev) => ({ ...prev, open: false }));

  return (
    <ConfirmDialogContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmDialog
        open={dialogState.open}
        onClose={closeConfirm}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        confirmColor={dialogState.confirmColor}
        showConfirmButton={dialogState.showConfirmButton}
        showCancelButton={dialogState.showCancelButton}
      />
    </ConfirmDialogContext.Provider>
  );
};
