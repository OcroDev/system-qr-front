//DEPENDENCIES
import { Department } from "../pure/department";
import styles from "../../styles/scrollbar.module.css";

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

//REACT
import { useEffect, useState } from "react";
//AXIOS
import axios from "axios";

import React from "react";
import Spinner from "../pure/spinner";
import { cm, db } from "../../print_services/logos";

export default function DepartmentList() {
  //STATES
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [idFromDepartment, setIdFromDepartment] = useState(0);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //FETCH DATA
  useEffect(() => {
    getAllDepartments();
  }, []);

  //METHODS
  function getAllDepartments() {
    setIsLoading(!isLoading);
    axios
      .get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/departments`)
      .then((response) => {
        const getAllDepartment = response.data.allDepartments;
        setDepartments(getAllDepartment);
      })
      .catch((error) => console.log(error.message))
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
    setIdFromDepartment(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseConfirmDialog = (idFromDepartment) => {
    setOpenDialog(false);
    deleteDepartment(idFromDepartment);
  };
  const deleteDepartment = (id) => {
    axios(
      `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/departments/${id}`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      setDeleteSuccess(true);
      setApiMessage(response.data.message);
      getAllDepartments();
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000);
    });
  };

  //Filtrado
  const departmentFilter = !search
    ? departments
    : departments.filter((data) =>
        data.d_name.toUpperCase().includes(search.toUpperCase())
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
              width: "60vw",
              height: "60vh",
              //overflowY: "scroll",
            }}
            className={styles.scrollbar}
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
                  alt=""
                  width={40}
                  height={50}
                />
                <Typography align="center" variant="h5">
                  DEPARTAMENTOS
                </Typography>
                <img
                  src={`data:image/png;base64,${cm}`}
                  alt=""
                  width={40}
                  height={50}
                />
              </div>
              <hr className="hr-style" />

              <TextField
                variant="standard"
                label="Buscar Departamento"
                type="text"
                value={search}
                onChange={searchHandler}
              ></TextField>
            </CardContent>
            <CardContent sx={{ height: "50vh" }}>
              <TableContainer
                sx={{
                  bgcolor: "background.paper",
                  marginTop: 0,
                  overflowY: "scroll",
                  height: "40vh",
                }}
                className={styles.scrollbar}
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
                        Nombre del Departamento
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
                    {departmentFilter.map((department) => {
                      return (
                        <Department
                          key={department.id}
                          id={department.id}
                          d_name={department.d_name}
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
                {"¿Estás seguro que deseas eliminar este departamento?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-description"
                  align="center"
                  sx={{ color: "#fff" }}
                >
                  {`Cuidado estás a punto de eliminar un departamento`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCloseConfirmDialog(idFromDepartment)}
                  autoFocus
                >
                  Eliminar
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
