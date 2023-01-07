import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Operation from "../pure/operation";
import { AddShoppingCart } from "@mui/icons-material";

export default function OperationsList() {
  //REDUX
  //STATE
  const [InOperations, setInOperations] = useState([]);
  const [OutOperations, setOutOperations] = useState([]);
  useEffect(() => {
    getInOperations();
    getOutOperations();
  }, []);

  //STYLES
  let divstyle = {
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
    height: "40vh",
  };

  //?methods
  const getInOperations = () => {
    const options = {
      method: "GET",
      url: "http://localhost:5000/qrstock/api/operations/in",
      headers: { "Content-Type": "application/json" },
    };

    axios
      .request(options)
      .then(function (response) {
        //      console.log(response.data);
        setInOperations(response.data.operations);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const getOutOperations = () => {
    const options = {
      method: "GET",
      url: "http://localhost:5000/qrstock/api/operations/out",
      headers: { "Content-Type": "application/json" },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        setOutOperations(response.data.operations);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const eliminarDuplicado = (arr) => {
    const operationsMap = arr.map((operation) => {
      return [operation.id, operation.id];
    });
    return [...new Map(operationsMap).values()];
  };

  const createOperationsArray = (operationArray, type) => {
    let idOperation = eliminarDuplicado(operationArray);
    let result = [];
    if (type === "in") {
      for (let i = 0; i < idOperation.length; i++) {
        let data = {};
        let contador = 0;

        for (const key in operationArray) {
          if (operationArray[key].id === idOperation[i]) {
            contador++;
            data.date = operationArray[key].date.substr(0, 10);
          }
        }
        data.id = idOperation[i];
        data.products = contador;
        contador = 0;
        result.push(Object.assign({}, data));
      }
    } else {
      for (let i = 0; i < idOperation.length; i++) {
        let data = {};
        let contador = 0;

        for (const key in operationArray) {
          if (operationArray[key].id === idOperation[i]) {
            contador++;
            data.date = operationArray[key].date.substr(0, 10);
            data.dep_in = operationArray[key].dep_in;
            data.warehouse_in = operationArray[key].warehouse_in;
          }
        }
        data.id = idOperation[i];
        data.products = contador;
        contador = 0;
        result.push(Object.assign({}, data));
      }
    }

    return result;
  };

  const OperationsInCell = createOperationsArray(InOperations, "in");
  const OperationsOutCell = createOperationsArray(OutOperations, "out");

  return (
    <>
      <Typography variant="h5" align="center" m={5}>
        Operaciones
      </Typography>
      <div>
        <Card
          sx={{
            height: "85vh",
            width: "50vw",
            bgcolor: "#efefef",
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              height: "40vh",
            }}
          >
            <CardContent>
              <Typography sx={{ m: 1, ml: 4, mb: -1 }} variant="h6">
                Entradas <AddShoppingCart fontSize="small" color="success" />
              </Typography>
            </CardContent>
            <div style={{ overflowY: "scroll" }}>
              <TableContainer sx={{ overflowY: "scroll", height: "30vh" }}>
                <Table>
                  <TableBody>
                    {OperationsInCell.map((operation) => {
                      return (
                        <Operation
                          id={operation.id}
                          date={operation.date}
                          productsTotal={operation.products}
                          inOut={"Productos Entrantes"}
                          type={"in"}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <Divider />
          <div style={divstyle}>
            <CardContent>
              <Typography sx={{ m: 1, ml: 4, mb: -1 }} variant="h6">
                Salidas <AddShoppingCart color="secondary" fontSize="small" />
              </Typography>
            </CardContent>
            <TableContainer>
              <Table>
                <TableBody>
                  {OperationsOutCell.map((operation) => {
                    return (
                      <Operation
                        id={operation.id}
                        date={operation.date}
                        productsTotal={operation.products}
                        inOut={"Productos Salientes"}
                        warehouse_in={operation.warehouse_in}
                        dep_in={operation.dep_in}
                        warehouse={"Destino: "}
                        dep={"departamento: "}
                        type={"out"}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Divider />
        </Card>
      </div>
    </>
  );
}
