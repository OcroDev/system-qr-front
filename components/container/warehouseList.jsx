//DEPENDENCIES
import { Warehouse } from "../pure/warehouse";

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
    setIsLoading(!isLoading)
    axios
      .get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/warehouses`)
      .then((response) => {
        const getAllWarehouse = response.data.allWarehouses;

        setWarehouses(getAllWarehouse);
      })
      .catch((error) => console.log(error)).finally(
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      )
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

  return (<>{isLoading ? <Spinner/> : 
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
            ALMACENES
          </Typography>

          <TextField
            variant="standard"
            label="Buscar Almacén"
            type="text"
            value={search}
            onChange={searchHandler}
          ></TextField>
        </CardContent>
        <CardContent>
          <TableContainer
            sx={{
              bgcolor: "background.paper",
              marginTop: 15,
            }}
          >
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
                    Nombre del Almacén
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
            {"¿Estás seguro que deseas eliminar este almacén?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              align="center"
              sx={{ color: "#fff" }}
            >
              {`Cuidado estás a punto de eliminar el almacen:`}
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
    </div>}
    </>
  );
}
