import { ArrowCircleLeft, Print, Update } from "@mui/icons-material";
import {
  Alert,
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
import printServices from "../../print_services/printServices";

export default function OutOperationDetail() {
  const [operation, setOperation] = useState([]);
  const [operationData, setOperationData] = useState({});
  const router = useRouter();
  const [userType, setUserType] = useState("");
  const [checked, setChecked] = useState("");
  const [success, setSuccess] = useState(false);

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
      .then((response) => {
        setChecked(response.data.message);
        setSuccess(true);
      })
      .catch((error) => {
        console.log(error.message);
        setChecked(error.message);
        setSuccess(false);
      })
      .finally(
        setTimeout(() => {
          setChecked("");
          setSuccess(false);
        }, 2000)
      );
  };

  const printQR = () => {
    let img = document.body.ownerDocument.images.item(0).currentSrc;
    const operationToPrint = {
      id: operationData.id,
      warehouse: operationData.warehouse_in,
      department: operationData.dep_in,
      dataImg: img,
    };
    printServices.printOutQr(operationToPrint);
  };

  const URI = `system-qr-inventory.vercel.app/reports/operations/detail/${operationData.id}`;

  return (
    <div>
      <Card
        sx={{
          display: "flex",
          mt: 0,
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
                <IconButton aria-label="print" onClick={() => printQR()}>
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
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {checked === "" ? null : success ? (
              <Alert color="success">{checked}</Alert>
            ) : (
              <Alert color="error">{checked}</Alert>
            )}
          </div>
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
              URI={URI}
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
