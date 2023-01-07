import { useState } from "react";
import Link from "next/link";
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
import { AddShoppingCartSharp } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/reducers/products/productOperationSlice";

export const InOutProduct = ({ p_description, id, stock, opType }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severityType, setSetSeverity] = useState(true);
  const [checkStock, setCheckStock] = useState(false);

  const productsInList = useSelector((state) => state.opProduct);

  //METHODS
  const addProductToList = () => {
    const product = {
      id: id,
      p_description: p_description,
      p_stock: quantity,
    };

    if (quantity <= 0) {
      return;
    }
    let finalStock = stock - quantity;
    if (opType === "OUT") {
      if (finalStock < 0) {
        setCheckStock(true);
        return;
      }
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

  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" sx={{ color: "#efefef" }}>
          {id}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {p_description}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {stock}
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
            <Tooltip title="Añadir producto">
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
                El producto fue agregado anteriormente
              </Alert>
            ) : (
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                Producto agregado
              </Alert>
            )}
          </Snackbar>
        </TableCell>
      </TableRow>
    </>
  );
};
