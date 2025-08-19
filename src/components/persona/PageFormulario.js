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

function PageFormulario() {
  const [value, setValue] = React.useState("0");
  const { tipoAccion, tipo, idPersona = null } = useParams(); // 'natural' o 'juridica'
  const { showSnackbar } = useSnackbar();
  const [dataPersona, setPersona] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    handleObtenerPersonaPorId(idPersona);
  }, [idPersona]);

  const handleObtenerPersonaPorId = async (idPersona) => {
    console.log(idPersona);
    setLoading(true);
    if (idPersona) {
      const res = await obtenerPersonaPorId(idPersona);
      if (res.tipoResultado === TipoResultado.SUCCESS.toString()) {
        console.log("esperando respuesta: ", res);
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
    <Container>
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
          titulo={
            tipo === "natural"
              ? "Crear persona natural"
              : "Crear persona jurídica"
          }
          rutaVolver="/personas"
          ocultar={true}
        />
        <TabContext value={value}>
          <Box sx={{ mt: -1, mb: 1, borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} centered>
              <Tab icon={<PersonIcon />} label="General" value="0" />
              <Tab icon={<BusinessIcon />} label="Empresas" value="1" />
              <Tab icon={<SchemaIcon />} label="Proyectos" value="2" />
            </TabList>
          </Box>
          <TabPanel value="0" sx={{ padding: 0 }}>
            <PageGeneralPersona
              tipoAccion={tipoAccion}
              idPersona={idPersona}
              tipo={tipo}
              dataPersona={dataPersona}
              onUpdatePersona={(nuevaPersona) => setPersona(nuevaPersona)} // ✅ sincroniza
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
