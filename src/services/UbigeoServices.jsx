import api from "../config/axiosConfig";

export const filtrarUbigeo = async (filtro) => {
  const res = await api.get(
    `/ubigeos/buscar?filtro=${encodeURIComponent(filtro)}`
  );
  return res.data;
};