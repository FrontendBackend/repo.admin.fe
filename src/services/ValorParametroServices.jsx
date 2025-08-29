import api from "../config/axiosConfig";

export const listarTiposDocumento = async () => {
  const res = await api.get("/valorParametros/listarTiposDocumento");
  return res.data;
};