// src/services/usuarioService.js
import api from "../config/axiosConfig";

export const listarUsuarios = async () => {
  const res = await api.get("/usuarios/listarUsuarios");
  return res.data;
};

export const obtenerUsuarioPorId = async (id) => {
  const res = await api.get(`/usuarios/obtenerUsuarioPorId/${id}`);
  return res.data;
};

export const crearUsuario = async (usuario) => {
  const res = await api.post("/usuarios/crearUsuario", usuario);
  return res.data;
};

export const modificarUsuario = async (id, usuario) => {
  const res = await api.put(`/usuarios/modificarUsuario/${id}`, usuario);
  return res.data;
};

export const eliminarUsuario = async (id) => {
  const res = await api.delete(`/usuarios/eliminarUsuario/${id}`);
  return res.data;
};
