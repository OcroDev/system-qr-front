//DEPENDENCIES
import { InOutDepartment } from "../pure/inOutDepartment";
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
  Alert,
} from "@mui/material";

//REACT
import { useEffect, useState } from "react";
//AXIOS
import axios from "axios";

import React from "react";
import { useSelector } from "react-redux";
import Spinner from "../pure/spinner";
import { cm, db } from "../../print_services/logos";

export default function InOutDepartmentList() {
  //STATES
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
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

  //Filtrado
  const departmentFilter = !search
    ? departments
    : departments.filter((data) =>
        data.d_name.toUpperCase().includes(search.toUpperCase())
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
              overflowY: "scroll",
            }}
            className={styles.scrollbar}
          >
            <CardContent
              sx={{
                position: "absolute",
                background: "#fff",
                width: "60vw",
                zIndex: "998",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <img
                  style={{ marginTop: 0 }}
                  src={`data:image/png;base64,${db}`}
                  alt=""
                  width={40}
                  height={50}
                />
                <Typography
                  fontFamily={"monospace"}
                  align="center"
                  variant="h5"
                >
                  DEPARTAMENTOS
                </Typography>
                <img
                  style={{ marginTop: 0 }}
                  src={`data:image/png;base64,${cm}`}
                  alt=""
                  width={40}
                  height={50}
                />
              </CardContent>
              <hr className="hr-style" />

              <TextField
                variant="standard"
                label="Buscar Departamento"
                type="text"
                value={search}
                onChange={searchHandler}
              ></TextField>
            </CardContent>
            <CardContent>
              <TableContainer
                sx={{
                  bgcolor: "background.paper",
                  marginTop: 20,
                  height: "37vh",
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
      )}
    </>
  );
}
