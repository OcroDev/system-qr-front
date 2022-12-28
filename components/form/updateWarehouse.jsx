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

export default function UpdateWarehouse() {
  //router
  const router = useRouter();

  //states
  const [warehouse, setWarehouse] = useState({});
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [found, setFound] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  //METHODS
  function getWarehouse() {
    const options = {
      method: "GET",
      url: `http://localhost:5000/qrstock/api/warehouses/update/${router.query.id}`,
    };

    axios
      .request(options)
      .then(function (response) {
        const newWarehouse = response.data.warehouse;

        setWarehouse(newWarehouse);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  useEffect(() => {
    getWarehouse();
  }, []);

  //Initial values for formik form
  const initialValues = {
    w_description: "",
  };

  //VALIDATION SCHEMA
  const validationSchema = yup.object().shape({
    w_description: yup
      .string("Ecribe el nombre del almacén")
      .min(5, "El nombre del almacén es demasiado corto")
      .max(25, "El nombre del almacén es demasiado largo")
      .required("El nombre del almacén es requerido"),
  });

  //BUILD FORMIK
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const options = {
        method: "PUT",
        url: `http://localhost:5000/qrstock/api/warehouses/update/${router.query.id}`,
        data: {
          w_description: values.w_description,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          const { data } = response;
          console.log(data.message);
          setApiMessage(data.message);
          setCreationSuccess(!creationSuccess);
          getWarehouse();
        })
        .catch(function (error) {
          if (error.response) {
            setFound(error.response.data.warehouseFound);
            setApiMessage(error.response.data.message);
          } else {
            setFound(true);
            setApiMessage("Error al conectarse al servidor");
          }
        })
        .finally(() => {
          values.w_description = "";
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
                Actualizar Almacén <br />"{warehouse.w_description}"
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
                  id="w_description"
                  name="w_description"
                  label="Nuevo nombre del Almacén"
                  type="text"
                  value={formik.values.w_description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.w_description &&
                    Boolean(formik.errors.w_description)
                  }
                  helperText={
                    formik.touched.w_description && formik.errors.w_description
                  }
                />
                <br />

                <div className="d-flex justify-content-center mt-2">
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    sx={{ mr: 2 }}
                  >
                    Actualizar Almacén
                  </Button>
                  <Button
                    type="reset"
                    size="large"
                    variant="outlined"
                    sx={{ ml: 0 }}
                    onClick={() => router.push("/warehouse/update")}
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
