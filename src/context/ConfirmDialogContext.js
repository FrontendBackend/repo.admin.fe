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
    onConfirm: () => {},
  });

  const showConfirm = ({ title, message, onConfirm }) => {
    setDialogState({
      open: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
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
      />
    </ConfirmDialogContext.Provider>
  );
};
