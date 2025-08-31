import api from "../config/axiosConfig";

export const filtrarUbigeo = async (filtro) => {
  const filtroNormalizado = normalizarTexto(filtro);
  const res = await api.get(
    `/ubigeos/buscar?filtro=${encodeURIComponent(filtroNormalizado)}`
  );
  return res.data;
};

function normalizarTexto(texto) {
  return texto
    .normalize("NFD") // separa letras y tildes
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/ñ/gi, "n") // reemplaza ñ -> n
    .toUpperCase(); // opcional: mayúsculas
}
