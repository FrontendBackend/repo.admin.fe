import api from "../config/axiosConfig";

export const listarPersona = async () => {
  const res = await api.get("/personas/listarPersona");
  return res.data;
};

export const obtenerPersonaPorId = async (idPersona) => {
  const res = await api.get(`/usuarios/obtenerPersonaPorId/${idPersona}`);
  return res.data;
};

export const crearPersona = async (persona) => {
  const res = await api.post("/usuarios/crearPersona", persona);
  return res.data;
};

export const modificarPersona = async (idPersona, persona) => {
  const res = await api.put(`/usuarios/modificarPersona/${idPersona}`, persona);
  return res.data;
};

export const eliminarPersona = async (idPersona) => {
  const res = await api.delete(`/usuarios/eliminarPersona/${idPersona}`);
  return res.data;
};
