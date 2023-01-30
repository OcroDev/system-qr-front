import {
  Table,
  TableBody,
  TableContainer,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Operation from "../pure/operation";
import ReportByDeparment from "./reportByDeparment";
import Spinner from "../pure/spinner";
import styles from "../../styles/scrollbar.module.css";
//tab panel methods
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

//? COMPONENT
export default function OperationsList() {
  //STATE
  const [InOperations, setInOperations] = useState([]);
  const [OutOperations, setOutOperations] = useState([]);
  const [value, setValue] = React.useState(0);
  const [searchDate, setSearchDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(!isLoading);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/operations/in`,
      headers: { "Content-Type": "application/json" },
    };

    axios
      .request(options)
      .then(function (response) {
        setInOperations(response.data.operations);
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(
        setTimeout(() => {
          setIsLoading(false);
        }, 500)
      );
  };
  const getOutOperations = () => {
    setIsLoading(!isLoading);
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/operations/out`,
      headers: { "Content-Type": "application/json" },
    };

    axios
      .request(options)
      .then(function (response) {
        setOutOperations(response.data.operations);
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(
        setTimeout(() => {
          setIsLoading(false);
        }, 500)
      );
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
            data.op_status = operationArray[key].op_status;
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const searchHandler = (e) => {
    setSearchDate(e.target.value);
  };

  const OperationsInCell = createOperationsArray(InOperations, "in");
  const OperationsOutCell = createOperationsArray(OutOperations, "out");

  //DATE FILTER
  const operationInDateFilter = !searchDate
    ? OperationsInCell
    : OperationsInCell.filter((data) =>
        data.date.toUpperCase().includes(searchDate.toUpperCase())
      );
  const operationOutDateFilter = !searchDate
    ? OperationsOutCell
    : OperationsOutCell.filter((data) =>
        data.date.toUpperCase().includes(searchDate.toUpperCase())
      );

  return (
    <>
      {/* <Box>
        <Typography variant="h6" align="center">
          Reportes
        </Typography>
      </Box> */}
      <Box sx={{ width: "70vw", bgcolor: "#efefef", mt: -10 }}>
        {isLoading ? (
          <div
            style={{
              height: "40vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner></Spinner>
          </div>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Entradas" {...a11yProps(0)} />
                <Tab label="Salidas" {...a11yProps(1)} />
                {/* <Tab label="Reporte por departamento" {...a11yProps(2)} /> */}
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <TableContainer
                sx={{ overflowY: "scroll", height: "40vh" }}
                className={styles.scrollbar}
              >
                <Table>
                  <TableBody>
                    {operationInDateFilter.map((operation) => {
                      return (
                        <Operation
                          key={operation.id}
                          id={operation.id}
                          date={operation.date}
                          productsTotal={operation.products}
                          inOut={"Materiales Entrantes"}
                          type={"in"}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TableContainer
                sx={{ overflowY: "scroll", height: "40vh" }}
                className={styles.scrollbar}
              >
                <Table>
                  <TableBody>
                    {operationOutDateFilter.map((operation) => {
                      return (
                        <Operation
                          key={operation.id}
                          id={operation.id}
                          date={operation.date}
                          productsTotal={operation.products}
                          inOut={"Materiales Salientes"}
                          warehouse_in={operation.warehouse_in}
                          dep_in={operation.dep_in}
                          warehouse={"Destino: "}
                          dep={"departamento: "}
                          type={"out"}
                          status={operation.op_status}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            {/* <TabPanel value={value} index={2}>
              <ReportByDeparment />
            </TabPanel> */}
          </>
        )}
        <Box sx={{ m: 3 }}>
          <TextField
            variant="standard"
            label="Filtrar por Fecha"
            type="text"
            value={searchDate}
            onChange={searchHandler}
            helperText={"dd / mm / aaaa"}
            color="info"
          ></TextField>
        </Box>
      </Box>
    </>
  );
}
