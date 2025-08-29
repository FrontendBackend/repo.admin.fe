import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeModeProvider } from './context/ThemeContext.jsx'
import { SnackbarProvider } from './context/SnackbarContext.jsx'
import { ConfirmDialogProvider } from './context/ConfirmDialogContext.jsx'

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <ThemeModeProvider>
      <SnackbarProvider>
        <ConfirmDialogProvider>
          <App />
        </ConfirmDialogProvider>
      </SnackbarProvider>
    </ThemeModeProvider>
  </StrictMode>
)
