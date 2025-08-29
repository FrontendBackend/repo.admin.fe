import * as yup from "yup";
import Constantes from "../utils/Constantes";

export const personaSchema = (tipo) => {
  return yup.object().shape({
    noPersona: yup.string().when([], {
      is: () => tipo === "natural",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    apPaterno: yup.string().when([], {
      is: () => tipo === "natural",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    apMaterno: yup.string().when([], {
      is: () => tipo === "natural",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    coDocumentoIdentidad: yup
      .string()
      .when([], {
        is: () => tipo === "natural" || tipo === "juridica",
        then: (s) => s.required("Es requerido"),
        otherwise: (s) => s.notRequired(),
      })
      .when("idTipoDocIdentidad", {
        is: Constantes.TIPOS_DOCUMENTO.DNI.toString(),
        then: (s) =>
          s
            .required("El DNI es obligatorio")
            .matches(/^[0-9]+$/, "Solo se permiten números")
            .length(8, "El DNI debe tener 8 dígitos"),
      })
      .when("idTipoDocIdentidad", {
        is: Constantes.TIPOS_DOCUMENTO.RUC.toString(),
        then: (s) =>
          s
            .required("El RUC es obligatorio")
            .matches(/^[0-9]+$/, "Solo se permiten números")
            .length(11, "El RUC debe tener 11 dígitos"),
      })
      .when("idTipoDocIdentidad", {
        is: Constantes.TIPOS_DOCUMENTO.CE.toString(),
        then: (s) =>
          s
            .required("El CE es obligatorio")
            .matches(/^[0-9]+$/, "Solo se permiten números")
            .max(20, "El CE puede tener hasta 20 dígitos"),
      }),

    idTipoDocIdentidad: yup.string().when([], {
      is: () => tipo === "natural" || tipo === "juridica",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    feNacimiento: yup.string().when([], {
      is: () => tipo === "natural",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    noPrefijoPersona: yup.string().when([], {
      is: () => tipo === "natural",
      then: (s) => s.notRequired("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    deCorreo: yup.string().when([], {
      is: () => tipo === "natural" || tipo === "juridica",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    deCorreo2: yup.string().when([], {
      is: () => tipo === "natural" || tipo === "juridica",
      then: (s) => s.notRequired("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    deTelefono: yup.string().when([], {
      is: () => tipo === "natural" || tipo === "juridica",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    deTelefono2: yup.string().when([], {
      is: () => tipo === "natural" || tipo === "juridica",
      then: (s) => s.notRequired("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    diPersona: yup.string().when([], {
      is: () => tipo === "natural" || tipo === "juridica",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    idUbigeo: yup
      .object({
        idUbigeo: yup.string().required(),
        codigoUbigeo: yup.string(),
        departamento: yup.string(),
        provincia: yup.string(),
        distrito: yup.string(),
      })
      .nullable() // 👈 permite null
      .when([], {
        is: () => tipo === "natural" || tipo === "juridica",
        then: (s) => s.required("Es requerido"),
        otherwise: (s) => s.notRequired(),
      }),
    tiSexo: yup.string().when([], {
      is: () => tipo === "natural",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
    noRazonSocial: yup.string().when([], {
      is: () => tipo === "juridica",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(), // si es "juridica" no es obligatorio
    }),
    flConsorcio: yup.string().when([], {
      is: () => tipo === "juridica",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(), // si es "juridica" no es obligatorio
    }),
    noCorto: yup.string().when([], {
      is: () => tipo === "juridica",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(), // si es "juridica" no es obligatorio
    }),
    deRestriccion: yup.string().when([], {
      is: () => tipo === "juridica",
      then: (s) => s.required("Es requerido"),
      otherwise: (s) => s.notRequired(), // si es "juridica" no es obligatorio
    }),
    cmNota: yup.string().when([], {
      is: () => tipo === "natural" || tipo === "juridica",
      then: (s) => s.notRequired("Es requerido"),
      otherwise: (s) => s.notRequired(), // si es "juridica" no es obligatorio
    }),
  });
};

