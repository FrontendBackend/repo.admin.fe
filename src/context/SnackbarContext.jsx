/* eslint-disable react-refresh/only-export-components */
// src/context/SnackbarContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import SnackbarAlerta from "../utils/SnackbarAlerta";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    mensaje: "",
    severity: "success", // info, success, warning, error
  });

  const showSnackbar = useCallback(({ mensaje, severity = "info" }) => {
    setSnackbar({ open: true, mensaje, severity });
  }, []);

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarAlerta
        open={snackbar.open}
        mensaje={snackbar.mensaje}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
