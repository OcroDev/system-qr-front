//DEPENDENCIES
import { User } from "../pure/user";

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

//REACT
import React, { useEffect, useState } from "react";

//AXIOS
import axios from "axios";

export default function UsersList() {
  //STATES
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [idFromUser, setIdFromUser] = useState(0);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  //FETCH DATA
  useEffect(() => {
    getAllUsers();
  }, []);

  //METHODS

  function getAllUsers() {
    axios
      .get("http://localhost:5000/qrstock/api/users")
      .then((response) => {
        const getAllUser = response.data.allUsers;

        setUsers(getAllUser);
      })
      .catch((error) => console.log(error));
  }

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  const handleOpenDialog = (id) => {
    setIdFromUser(id);
    setopenDialog(true);
  };
  const handleCloseDialog = () => {
    setopenDialog(false);
  };
  const handleCloseConfirmDialog = (idFromUser) => {
    setopenDialog(false);
    deleteUser(idFromUser);
  };

  const deleteUser = (id) => {
    axios(`http://localhost:5000/qrstock/api/users/${id}`, {
      method: "DELETE",
    }).then((response) => {
      setDeleteSuccess(true);
      setApiMessage(response.data.message);
      getAllUsers();
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000);
    });
  };

  //Filtrado
  const userFilter = !search
    ? users
    : users.filter((data) =>
        data.u_username.toUpperCase().includes(search.toUpperCase())
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
            USUARIOS
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
                    Nombre
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "#efefef", fontWeight: "bold" }}
                  >
                    Apellido
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "#efefef", fontWeight: "bold" }}
                  >
                    Nombre de Usuario
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
                {userFilter.map((user) => {
                  return (
                    <User
                      key={user.id}
                      id={user.id}
                      u_firstname={user.u_firstname}
                      u_lastname={user.u_lastname}
                      u_username={user.u_username}
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
              onClick={() => handleCloseConfirmDialog(idFromUser)}
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