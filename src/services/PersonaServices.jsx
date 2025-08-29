import api from "../config/axiosConfig";
import { Paginador } from "../utils/Paginador";

export const listarPersona = async () => {
  const res = await api.get("/personas/listarPersona");
  return res.data;
};

export const paginarPersona = async (filtro, paginador = new Paginador()) => {
  const res = await api.post(
    "/personas/paginarPersona",
    filtro, // body
    {
      params: {
        page: paginador.page,
        limit: paginador.limit,
        sort: paginador.sort,
      },
    }
  );
  return res.data; // este sería tu PageResponse
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
