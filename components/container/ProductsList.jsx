//DEPENDENCIES
import { Product } from "../pure/product";

//MATERIAL UI
import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  TextField,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
} from "@mui/material";

//MATERIAL ICONS
import { Search } from "@mui/icons-material";

//REACT
import React, { useEffect, useState } from "react";

//AXIOS
import axios from "axios";

export default function ProductsList() {
  //STATES
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [idFromProduct, setIdFromProduct] = useState(0);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  //FETCH DATA
  useEffect(() => {
    getAllProducts();
  }, []);

  //METHODS

  function getAllProducts() {
    axios
      .get("http://localhost:5000/qrstock/api/products")
      .then((response) => {
        const getAllProduct = response.data.allProducts;

        setProducts(getAllProduct);
      })
      .catch((error) => console.log(error));
  }

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  const handleOpenDialog = (id) => {
    setIdFromProduct(id);
    setopenDialog(true);
  };
  const handleCloseDialog = () => {
    setopenDialog(false);
  };
  const handleCloseConfirmDialog = (idFromProduct) => {
    setopenDialog(false);
    deleteProduct(idFromProduct);
  };

  const deleteProduct = (id) => {
    console.log("Id a eliminar: ", id);
    axios(`http://localhost:5000/qrstock/api/products/${id}`, {
      method: "DELETE",
    }).then((response) => {
      setDeleteSuccess(true);
      setApiMessage(response.data.message);
      getAllProducts();
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000);
    });
  };

  //Filtrado
  const productFilter = !search
    ? products
    : products.filter((data) =>
        data.p_description.toUpperCase().includes(search.toUpperCase())
      );

  return (
    <div>
      {deleteSuccess ? (
        <Alert severity="success" variant="standard">
          {apiMessage}
        </Alert>
      ) : null}

      <Card
        sx={{
          bgcolor: "#fff",
          mt: 20,
          width: "60vw",
          height: "60vh",
          overflowY: "scroll",
        }}
      >
        <CardContent
          sx={{
            position: "absolute",
            background: "#fff",
            width: "60vw",
            zIndex: "998",
          }}
        >
          <Typography fontFamily={"monospace"} align="center" variant="h5">
            PRODUCTOS
          </Typography>

          <TextField
            variant="standard"
            label="Buscar Producto"
            type="text"
            value={search}
            onChange={searchHandler}
          ></TextField>
        </CardContent>
        <CardContent>
          <TableContainer sx={{ bgcolor: "background.paper", marginTop: 15 }}>
            <Table sx={{ maxWidth: "70vw" }}>
              <TableHead sx={{ marginTop: 4 }}>
                <TableRow>
                  <TableCell sx={{ color: "#efefef", fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "#efefef", fontWeight: "bold" }}
                  >
                    Nombre del Producto
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "#efefef", fontWeight: "bold" }}
                  >
                    Ubicación
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#efefef", fontWeight: "bold" }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productFilter.map((product) => {
                  return (
                    <Product
                      key={product.id}
                      id={product.id}
                      p_desription={product.p_description}
                      p_ubication={product.p_ubication}
                      handleOpenDialog={handleOpenDialog}
                    />
                  );
                })}

                {/* <Product p_desription={products[0].p_desription} /> */}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <div>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ bgcolor: "background.default" }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ color: "warning.light", fontWeight: "bold" }}
          >
            {"¿Estás seguro que deseas eliminar este producto?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              align="center"
              sx={{ color: "#fff" }}
            >
              {`Cuidado estás a punto de eliminar el producto:`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleCloseConfirmDialog(idFromProduct)}
              autoFocus
            >
              Aceptar
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              color="success"
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
