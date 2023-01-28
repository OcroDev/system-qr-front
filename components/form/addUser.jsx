//FORMIK AND YUP
import { useFormik } from "formik";
import * as yup from "yup";
//REACT
import { useState } from "react";
//Axios
import axios from "axios";

//MATERIAL UI
import {
  Card,
  Alert,
  CardContent,
  Button,
  TextField,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { cm, db } from "../../print_services/logos";

export default function AddUser() {
  //states
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [found, setFound] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  //Initial values for formik form
  const initialValues = {
    u_firstname: "",
    u_lastname: "",
    u_username: "",
    u_password: "",
    confirm: "",
    u_type: "",
  };

  //VALIDATION SCHEMA
  const validationSchema = yup.object().shape({
    u_firstname: yup
      .string("Ecribe el primer nombre del usuario")
      .min(3, "El nombre del usuario es demasiado corto")
      .max(15, "El nombre del usuario es demasiado largo")
      .required("El nombre del usuario es requerido"),
    u_lastname: yup
      .string("Escribe el apellido del usuario")
      .min(3, "El apellido es demasiado corto")
      .max(10, "El apellido del usuario es demasiado largo"),
    u_username: yup
      .string("Escribe el nombre de usuario")
      .min(4, "El nombre del usuario es demasiado corto")
      .max(10, "El nombre de usuario es demasiado largo")
      .required("El nombre de usuario es requerido"),
    u_password: yup
      .string("Escribe una contraseña")
      .min(4, "La contraseña es demasiado corta")
      .max(15, "La contraseña es demasiado larga")
      .required("La contraseña es no puede estar vacía"),
    u_type: yup
      .string("Seleccioan el tipo de usuario")
      .required("El tipo de usuario es requerido"),
    confirm: yup
      .string()
      .when("u_password", {
        is: (value) => (value && value.length > 0 ? true : false),
        then: yup
          .string()
          .oneOf([yup.ref("u_password")], "Las contraseñas deben coincidir"),
      })
      .required("Debes confirmar la contraseña"),
  });

  //BUILD FORMIK
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/users`,
        data: {
          u_firstname: values.u_firstname,
          u_lastname: values.u_lastname,
          u_username: values.u_username,
          u_password: values.u_password,
          u_type: values.u_type,
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
            setFound(error.response.data.userFound);
            setApiMessage(error.response.data.message);
          } else {
            setFound(true);
            setApiMessage("Error al conectarse al servidor");
          }
        })
        .finally(() => {
          values.u_firstname = "";
          values.u_lastname = "";
          values.u_username = "";
          values.u_password = "";
          values.confirm = "";
          values.u_type = "";
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
            <Typography variant="h5">Crear un Nuevo Usuario</Typography>
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
                sx={{ mt: 4, width: "100%" }}
                variant="outlined"
                fullWidth
                id="u_firstname"
                name="u_firstname"
                label="Nombre"
                type="text"
                value={formik.values.u_firstname}
                onChange={formik.handleChange}
                error={
                  formik.touched.u_firstname &&
                  Boolean(formik.errors.u_firstname)
                }
                helperText={
                  formik.touched.u_firstname && formik.errors.u_firstname
                }
              />
              <br />
              <TextField
                sx={{ mt: 4, width: "100%" }}
                variant="outlined"
                fullWidth
                id="u_lastname"
                name="u_lastname"
                label="Apellido"
                type="text"
                value={formik.values.u_lastname}
                onChange={formik.handleChange}
                error={
                  formik.touched.u_lastname && Boolean(formik.errors.u_lastname)
                }
                helperText={
                  formik.touched.u_lastname && formik.errors.u_lastname
                }
              />
              <br />
              <TextField
                sx={{ mt: 4, width: "100%" }}
                variant="outlined"
                fullWidth
                id="u_username"
                name="u_username"
                label="Nombre de usuario"
                type="text"
                value={formik.values.u_username}
                onChange={formik.handleChange}
                error={
                  formik.touched.u_username && Boolean(formik.errors.u_username)
                }
                helperText={
                  formik.touched.u_username && formik.errors.u_username
                }
              />
              <br />
              <FormControl sx={{ width: "55%", mt: 4, mb: 0 }}>
                <InputLabel id="u_type-label">Tipo de Usuario</InputLabel>
                <Select
                  labelId="u_type-label"
                  id="u_type"
                  name="u_type"
                  label="Tipo de Usuaroi"
                  value={formik.values.u_type}
                  onChange={formik.handleChange}
                  className="mb-4"
                >
                  <MenuItem value="" sx={{ color: "#efefef" }}>
                    Selecciona el tipo de usuario
                  </MenuItem>
                  <MenuItem value={"worker"} sx={{ color: "#efefef" }}>
                    Almacenista
                  </MenuItem>
                  <MenuItem value={"client"} sx={{ color: "#efefef" }}>
                    Cliente
                  </MenuItem>
                </Select>
              </FormControl>
              <FormHelperText color="error">
                {formik.touched.u_type && Boolean(formik.errors.u_type)}
              </FormHelperText>
              <br />
              <TextField
                sx={{ mt: 0, width: "100%" }}
                variant="outlined"
                id="u_password"
                name="u_password"
                label="Contraseña"
                type="password"
                value={formik.values.u_password}
                onChange={formik.handleChange}
                className="mb-4"
                error={
                  formik.touched.u_password && Boolean(formik.errors.u_password)
                }
                helperText={
                  formik.touched.u_password && formik.errors.u_password
                }
              />
              <br />
              <TextField
                sx={{ mt: 4, width: "100%" }}
                variant="outlined"
                id="confirm"
                name="confirm"
                label="Confirmar contraseña"
                type="password"
                value={formik.values.confirm}
                onChange={formik.handleChange}
                className="mb-4"
                error={formik.touched.confirm && Boolean(formik.errors.confirm)}
                helperText={formik.touched.confirm && formik.errors.confirm}
              />
              <br />
              <div className="d-flex justify-content-center mt-4 ">
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  sx={{ mr: 2 }}
                >
                  Crear Usuario
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
