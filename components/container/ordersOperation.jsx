//axios
import axios from "axios";
//mui material
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
  Stack,
  AlertTitle,
} from "@mui/material";

//mui icons
import { Add, Remove } from "@mui/icons-material";

//formik
import { useFormik } from "formik";
import * as yup from "yup";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { deleteDepartment } from "../../redux/reducers/department/departmentOperationSlice";
import { setOperationType } from "../../redux/reducers/operations_type/operationTypeSlice";
import { MovementProduct } from "../pure/movementProduct";
import { deleteProducts } from "../../redux/reducers/products/productOperationSlice";
import { addOne } from "../../redux/reducers/orderBadge/orderBadgeSlice";

export default function OrdersOperation() {
  const router = useRouter();

  const dispatch = useDispatch();

  let date = new Date().toLocaleDateString("es-VE");

  //states
  const [lastOrder, setLastOrder] = useState(0);
  const [warehouses, setWarehouses] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openAlert, setOpenAlert] = useState("");
  const { department_name, department_id } = useSelector(
    (state) => state.opDepartment
  );

  const movementProducts = useSelector((state) => state.opProduct);
  const { u_id } = useSelector((state) => state.userLogin);

  //formik state and validations
  const initialValues = {
    warehouse_id: "",
    mov_note: "",
  };

  const validationSchema = yup.object().shape({
    warehouse_id: yup.string().required("El colegio es requerido* "),
    mov_note: yup
      .string()
      .max(255, "Las observaciones solo pueden contener 255 caracteres"),
  });

  //*METHODS

  useEffect(() => {
    getOrders();
    getAllWarehouses();
    dispatch(setOperationType(""));
  }, []);

  const createOrder = (newOrder, movnote) => {
    const options = {
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/orders`,
      data: {
        warehouse_id: newOrder.warehouse_id,
        user_id: newOrder.user_id,
        department_id: newOrder.department_id,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.data.status === 201) {
          createMovement(movnote);
          setOpenAlert("created");
        }
      })
      .catch((error) => setOpenAlert("failure"));
  };

  const createMovement = (movnote) => {
    movementProducts.products.map((product) => {
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/ordermovements`,
        data: {
          product_id: product.id,
          mov_quantity: product.p_stock,
          order_cod: lastOrder,
          mov_note: movnote,
        },
      };
      axios
        .request(options)
        .then((response) => {})
        .catch((error) => console.log(error.message));
    });
  };

  //Formik hook
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (movementProducts.totalcount > 0 && department_id != null) {
        let newOrder = {
          warehouse_id: values.warehouse_id,
          user_id: u_id,
          department_id: department_id,
        };
        createOrder(newOrder, values.mov_note);
        values.mov_note = "";
        values.warehouse_id = "";
        dispatch(deleteProducts());
        dispatch(deleteDepartment());
        getOrders();
        setTimeout(() => {
          setOpenAlert("");
        }, 3000);
        dispatch(addOne());
      } else {
        setOpenAlert("failure");
        setTimeout(() => {
          setOpenAlert("");
        }, 3000);
      }
    },

    onReset: () => {},
  });

  //snackbar
  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const getOrders = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/orders/last-id`,
      headers: { "Content-Type": "application/json" },
    };

    axios
      .request(options)
      .then((response) => {
        let getTotal = parseInt(response.data.total) + 1;
        setLastOrder(getTotal);
      })
      .catch((error) => {
        console.error(error.message);
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
            Pedido de Productos
          </Typography>
        </CardContent>
        <hr className="hr-style" />
        <form onSubmit={formik.handleSubmit}>
          <CardContent sx={{ display: "inline-flex", mr: "auto", ml: 10 }}>
            <InputLabel sx={{ mr: 5, mt: 2 }}>
              <b>Número:</b> {lastOrder}
            </InputLabel>
            <InputLabel sx={{ mr: 5, mt: 2 }}>
              <b>Fecha:</b> {date}
            </InputLabel>
            <FormControl sx={{ width: 250, mr: 5, mb: 0 }}>
              <InputLabel id="warehouse_id-label">Colegio</InputLabel>
              <Select
                variant="standard"
                labelId="warehouse_id-label"
                id="warehouse_id"
                name="warehouse_id"
                label="Colegio"
                value={formik.values.warehouse_id}
                onChange={formik.handleChange}
                className="mb-4"
                error={
                  formik.touched.warehouse_id &&
                  Boolean(formik.errors.warehouse_id)
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
                {formik.touched.warehouse_id && formik.errors.warehouse_id}
              </FormHelperText>
            </FormControl>
          </CardContent>
          <CardContent
            sx={{ display: "inline-flex", mr: "auto", ml: 10, mt: -5, mb: -5 }}
          >
            <InputLabel sx={{ ml: 0, mt: 0 }}>
              <b>Departamento:</b> {department_name}
            </InputLabel>

            <IconButton
              sx={{ color: "success.main", mt: -1 }}
              onClick={() => {
                dispatch(setOperationType("order"));
                router.push("/departments/operationDepartments/");
              }}
            >
              <Tooltip title="agregar">
                <Add />
              </Tooltip>
            </IconButton>
            <IconButton
              sx={{ color: "error.main", mt: -1 }}
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
            <div>
              <InputLabel className="label" id="mov_note">
                Observaciones:
              </InputLabel>
              <textarea
                className="textarea"
                id="mov_note"
                name="mov_note"
                onChange={formik.handleChange}
                value={formik.values.mov_note}
                rows="5"
                cols="33"
                placeholder="Escribe tus observaciones sobre el pedido"
              ></textarea>
            </div>
          </CardContent>
          <hr className="hr-style" />
          <div className="d-flex justify-content-center ">
            <Button
              type="submit"
              size="medium"
              variant="contained"
              sx={{ mr: 2 }}
            >
              Generar Pedido
            </Button>
            <Button
              type="button"
              size="medium"
              variant="outlined"
              sx={{ mr: 2 }}
              color="success"
              onClick={() => {
                //dispatch(setOperationType("OUT"));
                router.push("/products/orderProducts");
              }}
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
        <br />
        {openAlert === "created" ? (
          <Stack
            sx={{ width: "100%" }}
            alignItems="center"
            justifyContent="center"
          >
            <Alert variant="standard" color="success">
              <AlertTitle>Operación Exitosa</AlertTitle>
              Pedido generado
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
              No se pudo generar el pedido
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
          Productos eliminados
        </Alert>
      </Snackbar>
    </div>
  );
}
