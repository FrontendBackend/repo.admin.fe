import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SnackbarProvider } from "./context/SnackbarContext";
import { ConfirmDialogProvider } from "./context/ConfirmDialogContext";
import { ThemeModeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeModeProvider>
      <SnackbarProvider>
        <ConfirmDialogProvider>
          <App />
        </ConfirmDialogProvider>
      </SnackbarProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
