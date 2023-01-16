//DEPENDENCIES
import { InOutDepartment } from "../pure/inOutDepartment";

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
  Alert,
} from "@mui/material";

//REACT
import { useEffect, useState } from "react";
//AXIOS
import axios from "axios";

import React from "react";
import { useSelector } from "react-redux";

export default function InOutDepartmentList() {
  //STATES
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  //FETCH DATA
  useEffect(() => {
    getAllDepartments();
  }, []);

  //METHODS

  function getAllDepartments() {
    axios
      .get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/departments`)
      .then((response) => {
        const getAllDepartment = response.data.allDepartments;

        setDepartments(getAllDepartment);
      })
      .catch((error) => console.log(error));
  }

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  //Filtrado
  const departmentFilter = !search
    ? departments
    : departments.filter((data) =>
        data.d_name.toUpperCase().includes(search.toUpperCase())
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
            DEPARTAMENTOS
          </Typography>

          <TextField
            variant="standard"
            label="Buscar Departamento"
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
                    Nombre del Departamento
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#efefef", fontWeight: "bold" }}
                  >
                    Seleccionar
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentFilter.map((department) => {
                  return (
                    <InOutDepartment
                      key={department.id}
                      id={department.id}
                      d_name={department.d_name}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
