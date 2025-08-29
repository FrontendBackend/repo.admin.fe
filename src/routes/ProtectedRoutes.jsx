// src/ProtectedRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import PageUsuario from "../components/usuario/PageUsuario";
import PageUsuarioDetalle from "../components/usuario/PageUsuarioDetalle";
import PageListaPersona from "../components/persona/PageListaPersona";
import PageFormulario from "../components/persona/PageFormulario";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import ProfilePage from "../components/perfil/ProfilePage";
import SettingsPage from "../components/configuracion/SettingsPage";

const ProtectedRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Usuarios */}
        <Route path="/usuarios" element={<PageUsuario />} />
        <Route path="/usuarios/editar/:idUsuario" element={<PageUsuarioDetalle />}/>
        <Route path="/usuarios/ver/:idUsuario" element={<PageUsuarioDetalle />}/>

        {/* Personas  */}
        <Route path="/personas" element={<PageListaPersona />} />
        <Route path="/personas/:tipoAccion/:tipo" element={<PageFormulario />} />
        <Route path="/personas/:tipoAccion/:tipo/:idPersona" element={<PageFormulario />} />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
};

export default ProtectedRoutes;
