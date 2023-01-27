import { ArrowCircleLeft, Print, Update } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { cm, db } from "../../print_services/logos";
import QrCodeOperation from "../pure/qrCodeOperation";

export default function OutOperationDetail() {
  const [operation, setOperation] = useState([]);
  const [operationData, setOperationData] = useState({});
  const router = useRouter();
  const [userType, setUserType] = useState("");
  let DB = "COLEGIO LOS PIRINEOS DON BOSCO",
    CM = "COLEGIO METROPOLITANO";

  useEffect(() => {
    if (router.query.id) {
      getOperationById();
    }
    setUserType(localStorage.getItem("user"));
  }, []);

  const getOperationById = () => {
    if (router.query.id) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/operations/out-id`,
          {
            id: router.query.id,
          }
        )
        .then((response) => {
          const operationFind = response.data.operation;
          const dataFind = {
            id: response.data.operation[0].id,
            warehouse_in: response.data.operation[0].warehouse_in,
            dep_in: response.data.operation[0].dep_in,
          };
          console.log(operationFind);
          setOperation(operationFind);
          setOperationData(dataFind);
        })
        .catch((error) => console.log(error.message));
    }
  };

  const confirmOperation = (id) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/operations/status`,
        {
          id: id,
        }
      )
      .then((response) => console.log(response.data.message))
      .catch((error) => console.log(error.message));
  };

  return (
    <div>
      <Card
        sx={{
          display: "flex",
          mt: -30,
          bgcolor: "#efefef",
          flexDirection: "row",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h5"
              sx={{ mb: 2 }}
              color={"error"}
            ></Typography>
            <Typography variant="subtitle1" component="div">
              <b>Reporte: </b> #{operationData.id}
            </Typography>
            <Typography variant="subtitle1" component="div">
              <b>Destino: </b>
              {operationData.warehouse_in}
            </Typography>
            <Typography variant="subtitle1" component="div">
              <b>Departamento: </b>
              {operationData.dep_in}
            </Typography>
            <Typography>
              <b>Materiales:</b>
            </Typography>
            {operation.map(({ p_description, mov_quantity, p_unit }) => {
              return (
                <>
                  <Typography ml={1} key={p_description}>
                    🗃️{p_description}: |
                    <Typography variant="caption" ml={0}>
                      Cantidad:{" "}
                      <span style={{ color: "#001", fontWeight: "bold" }}>
                        {mov_quantity * -1}
                      </span>{" "}
                      {p_unit}
                    </Typography>
                    |
                  </Typography>
                </>
              );
            })}
          </CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              pl: 1,
              pb: 1,
            }}
          >
            {userType === "WORKER" ? (
              <>
                <IconButton aria-label="print" type="submit">
                  <Tooltip title="imprimir">
                    <Print color="primary" sx={{ height: 30, width: 30 }} />
                  </Tooltip>
                </IconButton>
                <Link href="/reports/operations">
                  <IconButton aria-label="next">
                    <Tooltip title="Regresar">
                      <ArrowCircleLeft
                        color="info"
                        sx={{ height: 30, width: 30 }}
                      />
                    </Tooltip>
                  </IconButton>
                </Link>
              </>
            ) : null}

            {userType === "CLIENT" ? (
              <>
                <IconButton
                  aria-label="next"
                  onClick={() => getOperationById()}
                >
                  <Tooltip title="Actulizar Info">
                    <Update color="info" sx={{ height: 30, width: 30 }} />
                  </Tooltip>
                </IconButton>
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => confirmOperation(operationData.id)}
                >
                  Recibido
                </Button>
              </>
            ) : null}
          </Box>
        </Box>

        <Box>
          <div
            style={{
              display: "flex",
              width: 200,
              height: 200,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <QrCodeOperation
              width={120}
              id={operationData.id}
            ></QrCodeOperation>
            {operationData.warehouse_in === DB ? (
              <img
                style={{
                  marginTop: 0,
                  position: "absolute",
                  backgroundColor: "#fff",
                }}
                src={`data:image/png;base64,${db}`}
                alt=""
                width={25}
                height={35}
              />
            ) : operationData.warehouse_in === CM ? (
              <img
                style={{
                  marginTop: 0,
                  position: "absolute",
                  backgroundColor: "#fff",
                }}
                src={`data:image/png;base64,${cm}`}
                alt=""
                width={25}
                height={35}
              />
            ) : null}
          </div>
        </Box>
      </Card>
    </div>
  );
}
