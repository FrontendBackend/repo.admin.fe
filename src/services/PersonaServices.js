import api from "../config/axiosConfig";

export const listarPersona = async () => {
  const res = await api.get("/personas/listarPersona");
  return res.data;
};

export const obtenerPersonaPorId = async (idPersona) => {
  const res = await api.get(`/personas/obtenerPersonaPorId/${idPersona}`);
  return res.data;
};

export const crearPersona = async (persona) => {
  const res = await api.post("/personas/crearPersona", persona);
  return res.data;
};

export const modificarPersona = async (idPersona, persona) => {
  const res = await api.put(`/personas/modificarPersona/${idPersona}`, persona);
  return res.data;
};

export const eliminarPersona = async (idPersona) => {
  const res = await api.delete(`/personas/eliminarPersona/${idPersona}`);
  return res.data;
};
