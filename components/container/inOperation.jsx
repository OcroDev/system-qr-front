import axios from "axios";

import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";
import { useEffect, useState } from "react";
import { MovementProduct } from "../pure/movementProduct";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { deleteProducts } from "../../redux/reducers/products/productOperationSlice";

export default function InOperation() {
  const [lastOperation, setLastOperation] = useState(0);
  const [warehouses, setWarehouses] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  const movementProducts = useSelector((state) => state.opProduct);
  const { u_id } = useSelector((state) => state.userLogin);

  useEffect(() => {
    getOperations();
    getAllWarehouses();
  }, []);

  //*FORMIK
  const initialValues = {
    w_description: "",
  };
  const validationSchema = yup.object().shape({
    w_description: yup.string().required("El almacen es requerido * "),
  });

  //* METHODS
  const getOperations = () => {
    const options = {
      method: "GET",
      url: "http://localhost:5000/qrstock/api/operations/last-id",
      headers: { "Content-Type": "application/json" },
    };

    axios
      .request(options)
      .then((response) => {
        let getTotal = response.data.operationId + 1;
        setLastOperation(getTotal);
      })
      .catch((error) => {
        console.error(error.data.message);
      });
  };
  const getAllWarehouses = () => {
    axios
      .get("http://localhost:5000/qrstock/api/warehouses")
      .then((response) => {
        const getAllWarehouse = response.data.allWarehouses;

        setWarehouses(getAllWarehouse);
      })
      .catch((error) => console.log(error));
  };

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const createOperation = (newOperation) => {
    // warehouse_out, u_make, dep_in, operation_type_id
    console.log(newOperation);
    const options = {
      method: "POST",
      url: "http://localhost:5000/qrstock/api/operations",
      data: {
        warehouse_out: newOperation.warehouse_out,
        u_make: newOperation.u_make,
        dep_in: newOperation.dep_in,
        operation_type_id: newOperation.operation_type_id,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        createMovement();
      })
      .catch((error) => console.log(error.message));
  };

  const createMovement = () => {
    movementProducts.products.map((product) => {
      const options = {
        method: "POST",
        url: "http://localhost:5000/qrstock/api/movements",
        data: {
          product_id: product.id,
          mov_quantity: product.p_stock,
          operation_cod: lastOperation,
          operation_type_id: 1,
        },
      };
      axios
        .request(options)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => console.log(error.message));
    });
  };

  const updateStockProduct = () => {
    movementProducts.products.map((product) => {
      const options = {
        method: "PUT",
        url: "http://localhost:5000/qrstock/api/products/update-stock",
        data: {
          id: product.id,
          p_stock: product.p_stock,
          operation_type: 1,
        },
      };
      axios
        .request(options)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error.message));
    });
  };

  //FORMIK HOOK
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (movementProducts.totalcount > 0) {
        console.log("enviando informacion");
        let newOperation = {
          warehouse_out: values.w_description,
          u_make: u_id,
          dep_in: 1,
          operation_type_id: 1,
        };
        createOperation(newOperation);
        // createMovement();
        updateStockProduct();
        dispatch(deleteProducts());
        getOperations();
        values.w_description = "";
      } else {
        console.log("faltan datos");
      }
    },
    onReset: () => {},
  });
  let date = new Date().toLocaleDateString("es-VE");

  return (
    <div>
      <Card
        sx={{
          bgcolor: "#fff",
          mt: 5,
          width: "77vw",
          height: "90vh",
          overflowY: "scroll",
        }}
      >
        <CardContent>
          <Typography fontFamily={"monospace"} align="center" variant="h5">
            Entrada de Productos
          </Typography>
        </CardContent>

        <hr className="hr-style" />
        <form onSubmit={formik.handleSubmit}>
          <CardContent sx={{ display: "inline-flex", mr: "auto", ml: 20 }}>
            <InputLabel sx={{ mr: 15, mt: 2 }}>
              <b>Numero:</b> {lastOperation}
            </InputLabel>
            <InputLabel sx={{ mr: 15, mt: 2 }}>
              <b>Fecha:</b> {date}
            </InputLabel>
            <FormControl sx={{ width: 250, mt: 0, mb: 0 }}>
              <InputLabel id="w_description-label">Almacén</InputLabel>
              <Select
                variant="standard"
                labelId="w_description-label"
                id="w_description"
                name="w_description"
                label="Almacén"
                value={formik.values.w_description}
                onChange={formik.handleChange}
                className="mb-4"
                error={
                  formik.touched.w_description &&
                  Boolean(formik.errors.w_description)
                }
                // helperText={

                // }
              >
                {warehouses.map((warehouse) => {
                  return (
                    <MenuItem
                      key={warehouse.id}
                      value={warehouse.id}
                      sx={{ color: "#efefef" }}
                    >
                      {warehouse.w_description}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText sx={{ color: "red" }}>
                {formik.touched.w_description && formik.errors.w_description}
              </FormHelperText>
            </FormControl>
          </CardContent>
          <hr className="hr-style" />
          <CardContent>
            <TableContainer>
              <div style={{ overflowY: "scroll", maxHeight: "50vh" }}>
                <Table>
                  <TableHead sx={{ marginTop: 4 }}>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        ID
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Nombre del Producto
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Cantidad
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Quitar
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {movementProducts.products.map((product, index) => {
                      return (
                        <MovementProduct
                          key={index}
                          id={product.id}
                          p_description={product.p_description}
                          p_stock={product.p_stock}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </CardContent>
          <hr className="hr-style" />
          <div className="d-flex justify-content-center ">
            <Button
              type="submit"
              size="medium"
              variant="contained"
              sx={{ mr: 2 }}
            >
              Generar Entrada
            </Button>
            <Button
              type="button"
              size="medium"
              variant="outlined"
              sx={{ mr: 2 }}
              color="success"
              onClick={() => router.push("/products/operationProducts")}
            >
              Añadir productos
            </Button>
            <Button
              type="button"
              size="medium"
              variant="outlined"
              sx={{ mr: 2 }}
              color="error"
              onClick={() => {
                dispatch(deleteProducts());
                handleOpenSnackbar();
              }}
            >
              Eliminar productos
            </Button>
          </div>
        </form>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Productos eliminados
        </Alert>
      </Snackbar>
    </div>
  );
}
