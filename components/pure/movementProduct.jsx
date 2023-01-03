import React, { useState } from "react";
import Link from "next/link";
//MATERIAL UI
import {
  TableCell,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

//MATERIAL ICONS
import { DeleteForever, RemoveShoppingCartOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { deleteOneProduct } from "../../redux/reducers/products/productOperationSlice";

export const MovementProduct = ({ p_description, p_stock, id }) => {
  //states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const movementProducts = useSelector((state) => state.opProduct);
  const dispatch = useDispatch();
  //methods
  const sendProductToDelete = () => {
    const index = movementProducts.products
      .map((product) => product.id)
      .indexOf(id);

    dispatch(deleteOneProduct(index));
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
        <TableCell
          align="center"
          component="th"
          scope="row"
          sx={{ color: "#" }}
        >
          {id}
        </TableCell>
        <TableCell align="center" sx={{ color: "#" }}>
          {p_description}
        </TableCell>
        <TableCell align="center" sx={{ color: "#" }}>
          {p_stock}
        </TableCell>
        <TableCell align="center">
          <IconButton
            sx={{ color: "error.main" }}
            onClick={() => {
              handleOpenSnackbar();
              sendProductToDelete();
            }}
          >
            <Tooltip title="Eliminar">
              <RemoveShoppingCartOutlined />
            </Tooltip>
          </IconButton>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={1000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              Producto eliminado
            </Alert>
          </Snackbar>
        </TableCell>
      </TableRow>
    </>
  );
};
