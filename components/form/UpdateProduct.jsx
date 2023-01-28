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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { cm, db } from "../../print_services/logos";

export default function UpdateProduct() {
  //router
  const router = useRouter();

  //ubication model
  const UBICATION = ["PAPELERÍA", "DEPÓSITO DE LIMPIEZA"];
  //states
  const [product, setProduct] = useState({});
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [found, setFound] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  //METHODS
  function getproduct() {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products/update/${router.query.id}`,
    };

    axios
      .request(options)
      .then(function (response) {
        const newProduct = response.data.product;

        setProduct(newProduct);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  useEffect(() => {
    getproduct();
  }, []);

  //Initial values for formik form
  const initialValues = {
    p_description: "",
    p_minstock: 0,
    p_unit: "",
    p_ubication: "",
  };

  //VALIDATION SCHEMA
  const validationSchema = yup.object().shape({
    p_description: yup
      .string("Ecribe el nombre del material")
      .min(5, "El nombre del material es demasiado corto")
      .max(25, "El nombre del material es demasiado largo")
      .required("El nombre del material es requerido"),
    p_minstock: yup.number("El stock mínimo debe ser un número"),
    p_unit: yup.string().max(10, "la unidad de medida es demasiado larga"),
    p_ubication: yup.string(),
  });

  //BUILD FORMIK
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products/update/${router.query.id}`,
        data: {
          p_description: values.p_description,
          p_minstock: values.p_minstock,
          p_unit: values.p_unit,
          p_ubication: values.p_ubication,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          const { data } = response;

          setApiMessage(data.message);
          setCreationSuccess(!creationSuccess);
          getproduct();
        })
        .catch(function (error) {
          if (error.response) {
            setFound(error.response.data.productFound);
            setApiMessage(error.response.data.message);
          } else {
            setFound(true);
            setApiMessage("Error al conectarse al servidor");
          }
        })
        .finally(() => {
          values.p_description = "";
          values.p_minstock = "";
          values.p_unit = "";
          values.p_ubication = "";
          setTimeout(() => {
            setFound(false);
            setCreationSuccess(false);
          }, 5000);
        });
    },
  });

  return (
    <>
      <Card sx={{ bgcolor: "#fff", mt: 0, width: "50vw" }}>
        <CardContent>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <img
                style={{ marginTop: 0 }}
                src={`data:image/png;base64,${db}`}
                alt=""
                width={40}
                height={50}
              />
              <Typography variant="h5" sx={{}}>
                Actualizar material <br />"{product.p_description}"
              </Typography>
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
                  sx={{ mt: 4, width: "80%" }}
                  variant="outlined"
                  fullWidth
                  id="p_description"
                  name="p_description"
                  label="Nuevo nombre del material"
                  type="text"
                  value={formik.values.p_description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.p_description &&
                    Boolean(formik.errors.p_description)
                  }
                  helperText={
                    formik.touched.p_description && formik.errors.p_description
                  }
                />
                <br />
                <TextField
                  sx={{ mt: 4, width: "45%" }}
                  variant="outlined"
                  fullWidth
                  id="p_minstock"
                  name="p_minstock"
                  label="Cantidad minima en Existencia"
                  type="number"
                  value={formik.values.p_minstock}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.p_minstock &&
                    Boolean(formik.errors.p_minstock)
                  }
                  helperText={
                    formik.touched.p_minstock && formik.errors.p_minstock
                  }
                />
                <br />
                <TextField
                  sx={{ mt: 4, width: "45%" }}
                  variant="outlined"
                  fullWidth
                  id="p_unit"
                  name="p_unit"
                  label="Unidad de medida"
                  type="text"
                  value={formik.values.p_unit}
                  onChange={formik.handleChange}
                  error={formik.touched.p_unit && Boolean(formik.errors.p_unit)}
                  helperText={formik.touched.p_unit && formik.errors.p_unit}
                />
                <br />
                <FormControl sx={{ width: "45%", mt: 4, mb: 4 }}>
                  <InputLabel id="ubication-label">Ubicación</InputLabel>
                  <Select
                    labelId="ubication-label"
                    id="p_ubication"
                    name="p_ubication"
                    label="Ubicación"
                    value={formik.values.p_ubication}
                    onChange={formik.handleChange}
                    className="mb-4"
                    error={
                      formik.touched.p_ubication &&
                      Boolean(formik.errors.p_ubication)
                    }
                  >
                    <MenuItem value="" sx={{ color: "#efefef" }}>
                      Selecciona la ubicacion
                    </MenuItem>
                    <MenuItem value={UBICATION[0]} sx={{ color: "#efefef" }}>
                      Papelería
                    </MenuItem>
                    <MenuItem value={UBICATION[1]} sx={{ color: "#efefef" }}>
                      Depósito de limpieza
                    </MenuItem>
                  </Select>
                </FormControl>
                <br />
                <div className="d-flex justify-content-center ">
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    sx={{ mr: 2 }}
                  >
                    Actualizar material
                  </Button>
                  <Button
                    type="reset"
                    size="large"
                    variant="outlined"
                    sx={{ ml: 0 }}
                    onClick={() => router.push("/products/update")}
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
