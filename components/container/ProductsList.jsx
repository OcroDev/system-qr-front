//DEPENDENCIES
import { Product } from "../pure/product";
import printServices from "../../print_services/printServices";
import styles from "../../styles/scrollbar.module.css";
//MATERIAL UI
import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
} from "@mui/material";

//MATERIAL ICONS

//REACT
import React, { useEffect, useState } from "react";

//AXIOS
import axios from "axios";
import Spinner from "../pure/spinner";
import { cm, db } from "../../print_services/logos";

export default function ProductsList() {
  //STATES
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [idFromProduct, setIdFromProduct] = useState(0);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //FETCH DATA
  useEffect(() => {
    getAllProducts();
  }, []);

  //METHODS

  function getAllProducts() {
    setIsLoading(!isLoading);

    axios
      .get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products`)
      .then((response) => {
        const getAllProduct = response.data.allProducts;

        setProducts(getAllProduct);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
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
    axios(
      `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products/${id}`,
      {
        method: "DELETE",
      }
    ).then((response) => {
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
    <>
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <div>
          {deleteSuccess ? (
            <Alert severity="success" variant="standard">
              {apiMessage}
            </Alert>
          ) : null}

          <Card
            sx={{
              bgcolor: "#fff",
              mt: 0,
              width: "75vw",
              height: "80vh",
            }}
          >
            <CardContent
              sx={{
                position: "absolute",
                background: "#fff",
                width: "75vw",
                zIndex: "998",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
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
                <Typography align="center" variant="h5">
                  Materiales
                </Typography>
                <img
                  style={{ marginTop: 0 }}
                  src={`data:image/png;base64,${cm}`}
                  alt=""
                  width={40}
                  height={50}
                />
              </div>
              <hr className="hr-style" />
              <TextField
                variant="standard"
                label="Buscar Material"
                type="text"
                value={search}
                onChange={searchHandler}
              ></TextField>

              <Button
                sx={{ ml: 10, mt: 2 }}
                onClick={() => {
                  printServices.printQr(products);
                }}
              >
                Imprimir reporte QR
              </Button>
            </CardContent>
            <CardContent>
              <TableContainer
                sx={{
                  bgcolor: "background.paper",
                  marginTop: 15,
                  maxHeight: "64vh",
                }}
                className={styles.scrollbar}
              >
                <Table sx={{ maxWidth: "75vw", maxHeight: "40vh" }}>
                  <TableHead sx={{ marginTop: 4 }}>
                    <TableRow>
                      {/* <TableCell sx={{ color: "#efefef", fontWeight: "bold" }}>
                    ID
                  </TableCell> */}
                      <TableCell
                        align="right"
                        sx={{ color: "#efefef", fontWeight: "bold" }}
                      >
                        Nombre del Material
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#efefef", fontWeight: "bold" }}
                      >
                        Existencia Mínimo
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#efefef", fontWeight: "bold" }}
                      >
                        Unidad de Medida
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
                      <TableCell
                        align="center"
                        sx={{ color: "#efefef", fontWeight: "bold" }}
                      >
                        QR Code
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
                          p_unit={product.p_unit}
                          p_minstock={product.p_minstock}
                          handleOpenDialog={handleOpenDialog}
                          p_stock={product.p_stock}
                        />
                      );
                    })}
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
                {"¿Estás seguro que deseas eliminar este Material?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-description"
                  align="center"
                  sx={{ color: "#fff" }}
                >
                  {`Cuidado estás a punto de eliminar el material`}
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
      )}
    </>
  );
}
