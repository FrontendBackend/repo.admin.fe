/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container, LinearProgress, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ToolbarDinamico from "../../utils/ToolbarDinamico";
import { useParams } from "react-router-dom";
import PageGeneralPersona from "./PageGeneralPersona";
import BusinessIcon from "@mui/icons-material/Business";
import SchemaIcon from "@mui/icons-material/Schema";
import PersonIcon from "@mui/icons-material/Person";
import { obtenerPersonaPorId } from "../../services/PersonaServices";
import TipoResultado from "../../utils/TipoResultado";
import { useSnackbar } from "../../context/SnackbarContext";
import TipoAccion from "../../utils/TipoAccion";

function PageFormulario() {
  const [value, setValue] = useState("0");

  // ⚡ renombramos para no colisionar
  const { tipoAccion: tipoAccionParam, tipo, idPersona = null } = useParams();
  const { showSnackbar } = useSnackbar();

  const [dataPersona, setPersona] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⚡ estado controlado para tipoAccion
  const [tipoAccion, setTipoAccion] = useState(
    tipoAccionParam ?? TipoAccion.CREAR.toString()
  );

  const titulo =
    tipo === "natural"
      ? tipoAccion === TipoAccion.CREAR.toString()
        ? "Crear persona natural"
        : tipoAccion === TipoAccion.EDITAR.toString()
        ? "Editar persona natural"
        : "Consultar persona natural"
      : tipoAccion === TipoAccion.CREAR.toString()
      ? "Crear persona jurídica"
      : tipoAccion === TipoAccion.EDITAR.toString()
      ? "Editar persona jurídica"
      : "Consultar persona jurídica";

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    handleObtenerPersonaPorId(idPersona);
  }, [idPersona]);

  const onUpdatePersona = (persona) => {
    setPersona(persona);
    console.log("sincroniza:", persona);
    
    // 👇 importante: si estabas en CREAR, ahora cambias a EDITAR
    if (tipoAccion === TipoAccion.CREAR.toString()) {
      setTipoAccion(TipoAccion.EDITAR.toString());
    }
  };

  const handleObtenerPersonaPorId = async (idPersona) => {
    console.log(idPersona);
    setLoading(true);
    if (idPersona) {
      const res = await obtenerPersonaPorId(idPersona);
      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
        // console.log("esperando respuesta: ", res);
        setPersona(res.data);
        setLoading(false);
      } else if (res.tipoResultado === TipoResultado.WARNING.toString()) {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.WARNING.toString().toLowerCase(),
        });
        setLoading(false);
      } else {
        showSnackbar({
          open: true,
          mensaje: res.mensaje,
          severity: TipoResultado.ERROR.toString().toLowerCase(),
        });
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 0 }}>
      {loading && (
        <Box
          sx={{
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <Box sx={{ width: "100%", typography: "body1" }}>
        <ToolbarDinamico
          titulo={titulo}
          rutaVolver="/personas"
          ocultar={true}
        />
        <TabContext value={value}>
          <Box sx={{ mt: -1, mb: 1, borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} centered>
              <Tab icon={<PersonIcon />} label="General" value="0" />
              {tipoAccion !== TipoAccion.CREAR.toString() && (
                <Tab icon={<BusinessIcon />} label="Empresas" value="1" />
              )}
              {tipoAccion !== TipoAccion.CREAR.toString() && (
                <Tab icon={<SchemaIcon />} label="Proyectos" value="2" />
              )}
            </TabList>
          </Box>
          <TabPanel value="0" sx={{ padding: 0 }}>
            <PageGeneralPersona
              tipoAccion={tipoAccion}
              idPersona={idPersona}
              tipo={tipo}
              dataPersona={dataPersona}
              onUpdatePersona={onUpdatePersona} // ✅ sincroniza con el padre
            />
          </TabPanel>
          <TabPanel value="1">Item Empresa</TabPanel>
          <TabPanel value="2">Item Proyectos</TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}

export default PageFormulario;
