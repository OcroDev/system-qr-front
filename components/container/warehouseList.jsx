//DEPENDENCIES
import { Warehouse } from "../pure/warehouse";
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

export default function WarehouseList() {
  //STATES
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [idFromWarehouse, setIdFromWarehouse] = useState(0);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //FETCH DATA
  useEffect(() => {
    getAllWarehouses();
  }, []);

  //METHODS

  function getAllWarehouses() {
    setIsLoading(!isLoading);
    axios
      .get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/warehouses`)
      .then((response) => {
        const getAllWarehouse = response.data.allWarehouses;

        setWarehouses(getAllWarehouse);
      })
      .catch((error) => console.log(error))
      .finally(
        setTimeout(() => {
          setIsLoading(false);
        }, 500)
      );
  }

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  const handleOpenDialog = (id) => {
    setIdFromWarehouse(id);
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
      `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/warehouses/${id}`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      setDeleteSuccess(true);
      setApiMessage(response.data.message);
      getAllWarehouses();
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000);
    });
  };

  //Filtrado
  const warehouseFilter = !search
    ? warehouses
    : warehouses.filter((data) =>
        data.w_description.toUpperCase().includes(search.toUpperCase())
      );

  return (
    <>
      {isLoading ? (
        <Spinner />
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
              width: "60vw",
              height: "60vh",
            }}
          >
            <CardContent
              sx={{
                background: "#fff",
                width: "60vw",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <img
                  src={`data:image/png;base64,${db}`}
                  alt="colegio don bosco"
                  width={40}
                  height={50}
                />
                <Typography align="center" variant="h5">
                  COLEGIOS
                </Typography>
                <img
                  src={`data:image/png;base64,${cm}`}
                  alt="colegio metropolitano"
                  width={40}
                  height={50}
                />
              </div>
              <hr className="hr-style" />
              <TextField
                variant="standard"
                label="Buscar colegio"
                type="text"
                value={search}
                onChange={searchHandler}
              ></TextField>
            </CardContent>
            <CardContent>
              <TableContainer
                sx={{
                  bgcolor: "background.paper",
                  marginTop: 0,
                  height: "40vh",
                  overflowY: "scroll",
                }}
                className={styles.scrollbar}
              >
                <Table sx={{ width: "100%" }}>
                  <TableHead sx={{ marginTop: 4 }}>
                    <TableRow>
                      <TableCell sx={{ color: "#efefef", fontWeight: "bold" }}>
                        ID
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#efefef", fontWeight: "bold" }}
                      >
                        Nombre del Colegio
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
                    {warehouseFilter.map((warehouse) => {
                      return (
                        <Warehouse
                          key={warehouse.id}
                          id={warehouse.id}
                          w_description={warehouse.w_description}
                          handleOpenDialog={handleOpenDialog}
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
                {"¿Estás seguro que deseas eliminar este colegio?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-description"
                  align="center"
                  sx={{ color: "#fff" }}
                >
                  {`Cuidado estás a punto de eliminar el colegio:`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCloseConfirmDialog(idFromWarehouse)}
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
