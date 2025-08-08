// src/ProtectedRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import AdminDashboard from "./AdminDashboard";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import PageUsuario from "./components/usuario/PageUsuario";
import PageUsuarioDetalle from "./components/usuario/PageUsuarioDetalle";
import PageListaPersona from "./components/persona/PageListaPersona";

const ProtectedRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Usuarios */}
        <Route path="/usuarios" element={<PageUsuario />} />
        <Route path="/usuarios/editar/:idUsuario" element={<PageUsuarioDetalle />} />
        <Route path="/usuarios/ver/:idUsuario" element={<PageUsuarioDetalle />} />

        {/* Personas  */}
        <Route path="/personas" element={<PageListaPersona />} />
        <Route path="/personas/crearPersonaNatural" element={<PageListaPersona />} />
        <Route path="/personas/editarPersonaNatural/:idPersonaNatural" element={<PageListaPersona />} />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
};

export default ProtectedRoutes;
