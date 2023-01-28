//react
import { useState } from "react";

//FORMIK
import { useFormik } from "formik";
import * as yup from "yup";

//MATERIAL
import {
  Card,
  Alert,
  CardContent,
  Button,
  TextField,
  Typography,
} from "@mui/material";

//AXIOS
import axios from "axios";
import { cm, db } from "../../print_services/logos";

export default function AddDepartment() {
  //states variable
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [found, setFound] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  //Initial values for formik form
  const initialValues = {
    d_name: "",
  };

  const validationSchema = yup.object().shape({
    d_name: yup
      .string("Ecribe el nombre del departamento")
      .min(5, "El nombre del departamento es demasiado corto")
      .max(25, "El nombre del departamento es demasiado largo")
      .required("El nombre del departamento es requerido"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/departments`,
        data: {
          d_name: values.d_name,
        },
      };

      axios
        .request(options)
        .then(function (response) {
          const { data } = response;

          setApiMessage(data.message);
          setCreationSuccess(!creationSuccess);
        })
        .catch(function (error) {
          if (error.response) {
            setFound(error.response.data.departmentFound);
            setApiMessage(error.response.data.message);
          } else {
            setFound(true);
            setApiMessage("Error al conectarse al servidor");
          }
        })
        .finally(() => {
          values.d_name = "";
          setTimeout(() => {
            setFound(false);
            setCreationSuccess(false);
          }, 5000);
        });
    },
    onReset: () => {},
  });

  return (
    <Card sx={{ bgcolor: "#fff", mt: 0, width: "50vw" }}>
      <CardContent>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <img
              style={{ marginTop: 0 }}
              src={`data:image/png;base64,${db}`}
              alt=""
              width={40}
              height={50}
            />
            <Typography variant="h6">Crear un Nuevo Departamento</Typography>
            <img
              style={{ marginTop: 0 }}
              src={`data:image/png;base64,${cm}`}
              alt=""
              width={40}
              height={50}
            />
          </div>

          <form
            onSubmit={formik.handleSubmit}
            onReset={formik.handleReset}
            className=" d-flex justify-content-center align-item-center"
          >
            <div style={{ width: "90%" }}>
              <TextField
                sx={{ mb: 4, mt: 4, width: "100%" }}
                variant="outlined"
                fullWidth
                id="d_name"
                name="d_name"
                label="Nombre del Departamento"
                type="text"
                value={formik.values.d_name}
                onChange={formik.handleChange}
                error={formik.touched.d_name && Boolean(formik.errors.d_name)}
                helperText={formik.touched.d_name && formik.errors.d_name}
              />

              <div className="d-flex justify-content-center">
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  sx={{ mr: 2 }}
                >
                  Crear Departamento
                </Button>
                <Button
                  type="reset"
                  size="large"
                  variant="outlined"
                  sx={{ ml: 0 }}
                >
                  Cancelar
                </Button>
              </div>
              <div className="mt-4">
                {creationSuccess ? (
                  <Alert severity="success" variant="standard">
                    {apiMessage}
                  </Alert>
                ) : null}
                {found ? (
                  <Alert severity="error" variant="standard">
                    {apiMessage}
                  </Alert>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
