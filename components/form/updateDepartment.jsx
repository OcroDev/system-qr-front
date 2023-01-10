//NEXTJS
import { useRouter } from "next/router";

//FORMIK AND YUP
import { useFormik } from "formik";
import * as yup from "yup";
//REACT
import { useEffect, useState } from "react";
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
} from "@mui/material";

export default function UpdateDepartment() {
  //router
  const router = useRouter();

  //states
  const [department, setDepartment] = useState({});
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [found, setFound] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  //METHODS
  function getDepartment() {
    const options = {
      method: "GET",
      url: `http://localhost:5000/qrstock/api/departments/update/${router.query.id}`,
    };

    axios
      .request(options)
      .then(function (response) {
        const newDepartment = response.data.department;

        setDepartment(newDepartment);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  useEffect(() => {
    getDepartment();
  }, []);

  //Initial values for formik form
  const initialValues = {
    d_name: "",
  };

  //VALIDATION SCHEMA
  const validationSchema = yup.object().shape({
    d_name: yup
      .string("Ecribe el nombre del departamento")
      .min(5, "El nombre del departamento es demasiado corto")
      .max(25, "El nombre del departamento es demasiado largo")
      .required("El nombre del departamento es requerido"),
  });

  //BUILD FORMIK
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const options = {
        method: "PUT",
        url: `http://localhost:5000/qrstock/api/departments/update/${router.query.id}`,
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
          getDepartment();
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
  });

  return (
    <>
      <Card sx={{ bgcolor: "#fff", mt: 20, width: "50vw" }}>
        <CardContent>
          <div>
            <div>
              <Typography variant="h5" style={{ textAlign: "center" }}>
                Actualizar Departamento <br />"{department.d_name}"
              </Typography>
            </div>

            <form
              onSubmit={formik.handleSubmit}
              onReset={formik.handleReset}
              className=" d-flex justify-content-center align-item-center"
            >
              <div>
                <TextField
                  sx={{ mt: 4, width: 500 }}
                  variant="outlined"
                  fullWidth
                  id="d_name"
                  name="d_name"
                  label="Nuevo nombre del Departamento"
                  type="text"
                  value={formik.values.d_name}
                  onChange={formik.handleChange}
                  error={formik.touched.d_name && Boolean(formik.errors.d_name)}
                  helperText={formik.touched.d_name && formik.errors.d_name}
                />
                <br />

                <div className="d-flex justify-content-center mt-2">
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    sx={{ mr: 2 }}
                  >
                    Actualizar Departamento
                  </Button>
                  <Button
                    type="reset"
                    size="large"
                    variant="outlined"
                    sx={{ ml: 0 }}
                    onClick={() => router.push("/departments/update")}
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
    </>
  );
}
