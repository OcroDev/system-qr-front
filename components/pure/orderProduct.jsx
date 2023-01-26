import { useState } from "react";
import axios from "axios";
//MATERIAL UI
import {
  TableCell,
  TableRow,
  IconButton,
  Tooltip,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

//MATERIAL ICONS
import { AddShoppingCartSharp, WarningAmber } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/reducers/products/productOperationSlice";

export const OrderProduct = ({
  p_description,
  id,
  stock,
  opType,
  minstock,
}) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openMinStockSnackbar, setOpenMinStockSnackbar] = useState(false);
  const [severityType, setSetSeverity] = useState(true);
  const [checkStock, setCheckStock] = useState(false);

  const productsInList = useSelector((state) => state.opProduct);

  //METHODS
  const addProductToList = async () => {
    const product = {
      id: id,
      p_description: p_description,
      p_stock: quantity,
    };

    if (quantity <= 0) {
      return;
    }

    const find = productsInList.products.find((product) => product.id === id);

    if (find) {
      setSetSeverity(false);
    } else {
      setSetSeverity(true);
      dispatch(addProduct(product));
    }
  };

  const handleChangeQuantity = (e) => {
    setQuantity(e.target.value);
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

  const handleCloseMinStockSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMinStockSnackbar(false);
  };

  let minStockTooltip = (
    <IconButton color="secondary">
      <Tooltip title="Material en existencia mínima">
        <WarningAmber />
      </Tooltip>
    </IconButton>
  );

  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" sx={{ color: "#efefef" }}>
          {id}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {p_description}
        </TableCell>

        <TableCell align="right">
          <TextField
            type="number"
            onChange={(e) => handleChangeQuantity(e)}
            variant="standard"
            sx={{ width: "5rem", color: "#fff" }}
            placeholder="0"
            color="warning"
          />
        </TableCell>
        <TableCell align="center">
          <IconButton
            onClick={() => {
              addProductToList();
              handleOpenSnackbar();
            }}
            color="warning"
          >
            <Tooltip title="Añadir material">
              <AddShoppingCartSharp />
            </Tooltip>
          </IconButton>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {quantity <= 0 ? (
              <Alert
                onClose={handleCloseSnackbar}
                severity="warning"
                sx={{ width: "100%" }}
              >
                La cantidad no puede ser 0 o menor a cero
              </Alert>
            ) : checkStock ? (
              <Alert
                onClose={handleCloseSnackbar}
                severity="error"
                sx={{ width: "100%" }}
              >
                La cantidad supera el Stock actual
              </Alert>
            ) : !severityType ? (
              <Alert
                onClose={handleCloseSnackbar}
                severity="error"
                sx={{ width: "100%" }}
              >
                El material fue agregado anteriormente
              </Alert>
            ) : (
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                material agregado
              </Alert>
            )}
          </Snackbar>
          <Snackbar
            open={openMinStockSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseMinStockSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="warning"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Cuidado el material {p_description} quedará en existencia mínima
            </Alert>
          </Snackbar>
        </TableCell>
      </TableRow>
    </>
  );
};
