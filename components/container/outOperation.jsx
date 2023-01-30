import styles from "../../styles/scrollbar.module.css";
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
  IconButton,
  Tooltip,
  TextField,
  AlertTitle,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";
import { useEffect, useState } from "react";
import { MovementProduct } from "../pure/movementProduct";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { deleteProducts } from "../../redux/reducers/products/productOperationSlice";
import {
  deleteDepartment,
  addDepartment,
} from "../../redux/reducers/department/departmentOperationSlice";
import { setOperationType } from "../../redux/reducers/operations_type/operationTypeSlice";
import { Add, Remove } from "@mui/icons-material";
import { cm, db } from "../../print_services/logos";

export default function OutOperation() {
  const [lastOperation, setLastOperation] = useState(0);
  const [warehouses, setWarehouses] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openAlert, setOpenAlert] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();

  const { department_name, department_id } = useSelector(
    (state) => state.opDepartment
  );

  const movementProducts = useSelector((state) => state.opProduct);
  const { u_id } = useSelector((state) => state.userLogin);
  let date = new Date().toLocaleDateString("es-VE");

  useEffect(() => {
    getOperations();
    getAllWarehouses();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(deleteDepartment());
    };
  }, []);

  //*FORMIK
  const initialValues = {
    warehouse_in_id: "",
    warehouse_out_id: "",
  };
  const validationSchema = yup.object().shape({
    warehouse_in_id: yup
      .string()
      .required("El colegio de destino es requerido* "),
    warehouse_out_id: yup
      .string()
      .required("El colegio de origen es requerido* "),
  });

  //* METHODS
  const getOperations = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/operations/last-id`,
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
      .get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/warehouses`)
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

    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/operations`,
      data: {
        warehouse_out: newOperation.warehouse_out,
        warehouse_in: newOperation.warehouse_in,
        u_make: newOperation.u_make,
        dep_in: newOperation.dep_in,
        operation_type_id: newOperation.operation_type_id,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.data.status === 201) {
          createMovement();
          updateStockProduct();
          setOpenAlert("created");
        }
      })
      .catch((error) => setOpenAlert("failure"));
  };

  const createMovement = () => {
    movementProducts.products.map((product) => {
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/movements`,
        data: {
          product_id: product.id,
          mov_quantity: product.p_stock,
          operation_cod: lastOperation,
          operation_type_id: 2,
        },
      };
      axios
        .request(options)
        .then((response) => {})
        .catch((error) => console.log(error.message));
    });
  };

  const updateStockProduct = () => {
    movementProducts.products.map((product) => {
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products/update-stock`,
        data: {
          id: product.id,
          p_stock: product.p_stock,
          operation_type: 2,
        },
      };
      axios
        .request(options)
        .then((response) => {})
        .catch((error) => console.log(error.message));
    });
  };

  //FORMIK HOOK
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (movementProducts.totalcount > 0 && department_id != null) {
        let newOperation = {
          warehouse_out: values.warehouse_out_id,
          warehouse_in: values.warehouse_in_id,
          u_make: u_id,
          dep_in: department_id,
          operation_type_id: 2,
        };
        createOperation(newOperation);
        dispatch(deleteProducts());
        dispatch(deleteDepartment());
        getOperations();
        values.warehouse_in_id = "";
        setOpenAlert("created");
        setTimeout(() => {
          setOpenAlert("");
        }, 3000);
      } else {
        setOpenAlert("failure");
        setTimeout(() => {
          setOpenAlert("");
        }, 3000);
      }
    },
    onReset: () => {},
  });

  return (
    <div>
      <Card
        sx={{
          bgcolor: "#fff",
          mt: 5,
          width: "77vw",
          maxHeight: "80vh",
          overflowY: "scroll",
        }}
        className={styles.scrollbar}
      >
        <CardContent
          sx={{
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
          <Typography fontFamily={"monospace"} align="center" variant="h5">
            Salida de Materiales
          </Typography>
          <img
            style={{ marginTop: 0 }}
            src={`data:image/png;base64,${cm}`}
            alt=""
            width={40}
            height={50}
          />
        </CardContent>

        <hr className="hr-style" />
        <form onSubmit={formik.handleSubmit}>
          <CardContent
            sx={{
              display: "inline-flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            <InputLabel>
              <b>Número:</b> {lastOperation}
            </InputLabel>
            <InputLabel>
              <b>Fecha:</b> {date}
            </InputLabel>
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="warehouse_in_id-label">
                Colegio destino
              </InputLabel>
              <Select
                variant="standard"
                labelId="warehouse_in_id-label"
                id="warehouse_in_id"
                name="warehouse_in_id"
                label="Colegio"
                value={formik.values.warehouse_in_id}
                onChange={formik.handleChange}
                className="mb-4"
                error={
                  formik.touched.warehouse_in_id &&
                  Boolean(formik.errors.warehouse_in_id)
                }
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
                {formik.touched.warehouse_in_id &&
                  formik.errors.warehouse_in_id}
              </FormHelperText>
            </FormControl>
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="warehouse_out_id-label">
                Colegio Origen
              </InputLabel>
              <Select
                variant="standard"
                labelId="warehouse_out_id-label"
                id="warehouse_out_id"
                name="warehouse_out_id"
                label="Colegio Origen"
                value={formik.values.warehouse_out_id}
                onChange={formik.handleChange}
                className="mb-4"
                error={
                  formik.touched.warehouse_out_id &&
                  Boolean(formik.errors.warehouse_out_id)
                }
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
                {formik.touched.warehouse_out_id &&
                  formik.errors.warehouse_out_id}
              </FormHelperText>
            </FormControl>
          </CardContent>
          <CardContent
            sx={{
              display: "inline-flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              ml: 2,
            }}
          >
            <InputLabel sx={{ ml: 0, mt: 0 }}>
              <b>Departamento Destino:</b> {department_name}
            </InputLabel>

            <IconButton
              sx={{ color: "success.main" }}
              onClick={() => {
                router.push("/departments/operationDepartments/");
              }}
            >
              <Tooltip title="agregar">
                <Add />
              </Tooltip>
            </IconButton>
            <IconButton
              sx={{ color: "error.main" }}
              onClick={() => {
                dispatch(deleteDepartment());
              }}
            >
              <Tooltip title="quitar">
                <Remove />
              </Tooltip>
            </IconButton>
          </CardContent>
          <hr className="hr-style" />
          <CardContent>
            <TableContainer
              sx={{ overflowY: "scroll", maxHeight: "35vh" }}
              className={styles.scrollbar}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      ID
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Nombre del Material
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
            </TableContainer>
          </CardContent>
          {/* <InputLabel /> */}
          <hr className="hr-style" />
          <div className="d-flex justify-content-center ">
            <Button
              type="submit"
              size="medium"
              variant="contained"
              sx={{ mr: 2 }}
            >
              Generar Salida
            </Button>
            <Button
              type="button"
              size="medium"
              variant="outlined"
              sx={{ mr: 2 }}
              color="success"
              onClick={() => {
                dispatch(setOperationType("OUT"));
                router.push("/products/operationProducts");
              }}
            >
              Añadir Materiales
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
              Eliminar Materiales
            </Button>
          </div>
        </form>
        <br />
        {openAlert === "created" ? (
          <Stack
            sx={{ width: "100%" }}
            alignItems="center"
            justifyContent="center"
          >
            <Alert variant="standard" color="success">
              <AlertTitle>Operación Exitosa</AlertTitle>
              Salida generada
            </Alert>
          </Stack>
        ) : openAlert === "failure" ? (
          <Stack
            sx={{ width: "100%" }}
            alignItems="center"
            justifyContent="center"
          >
            <Alert variant="standard" color="error">
              <AlertTitle>Operación Fallida</AlertTitle>
              No se pudo generar la Salida
            </Alert>
          </Stack>
        ) : null}
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
          Materiales eliminados
        </Alert>
      </Snackbar>
    </div>
  );
}
