import {
  CheckCircle,
  DeleteForever,
  Print,
  RadioButtonChecked,
  QrCode2,
  ScheduleSend,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import printServices from "../../print_services/printServices";
import axios from "axios";
import { useRouter } from "next/router";

export default function Operation(props) {
  const [deleted, setDeleted] = useState(false);
  const router = useRouter();

  const updateStockProduct = (movements) => {
    movements.map((product) => {
      const type = props.type === "in" ? 1 : 2;
      const options = {
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/products/update-stock`,
        data: {
          id: product.product_id,
          p_stock: product.mov_quantity,
          operation_type: type,
        },
      };
      axios
        .request(options)
        .then((response) => {})
        .catch((error) => console.log(error.message));
    });
  };
  const deleteOperation = () => {
    let operationURI = `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/operations/delete`;
    let movementsURI = `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/movements/delete`;
    let operationCodURI = `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/movements/op-cod`;
    axios
      .put(operationURI, {
        id: props.id,
      })
      .then(async (response) => {
        if (response.data.status === 200) {
          axios
            .put(movementsURI, {
              id: props.id,
            })
            .then((response) => {})
            .catch((error) => console.log(error));

          let response, movements;
          try {
            response = await axios.post(operationCodURI, {
              operation_cod: props.id,
            });
          } catch (error) {
            console.log(error.message);
          }
          movements = response.data.movements;
          updateStockProduct(movements);
        }
      })
      .catch((error) => console.log(error.message));
  };

  let operation = (
    <TableRow>
      <TableCell>
        <Card
          sx={{
            bgcolor: "#fff",
            color: "#373739",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" ml={"-1.5rem"}>
              <span>
                <b>Fecha: </b>
                {props.date}
              </span>
            </Typography>
            <Typography variant="body2">
              <span>
                <b>Reporte # </b>({props.id})
              </span>
            </Typography>
            <Typography variant="body2">
              <span>
                <b>{props.inOut}: </b>({props.productsTotal})
              </span>
            </Typography>
            {props.type === "out" ? (
              <IconButton
                sx={{ color: "primary.main" }}
                onClick={() => {
                  router.push(`/reports/operations/detail/${props.id}`);
                }}
                size="small"
              >
                <Tooltip title="Imprimir QR">
                  <QrCode2 />
                </Tooltip>
              </IconButton>
            ) : null}

            <IconButton
              sx={{ color: "primary.main" }}
              onClick={() => {
                printServices.operationReport(props.type, props.id);
              }}
              size="small"
            >
              <Tooltip title="Imprimir">
                <Print />
              </Tooltip>
            </IconButton>
            <IconButton
              sx={{ color: "error.main" }}
              onClick={() => {
                setDeleted(true);
                deleteOperation();
              }}
              size="small"
            >
              <Tooltip title="Eliminar">
                <DeleteForever />
              </Tooltip>
            </IconButton>
            {props.type === "in" ? null : !props.status ? (
              <Tooltip title="Por entregar" color="warning" disabled>
                <ScheduleSend />
              </Tooltip>
            ) : (
              <Tooltip title="Entregado" disabled color="success">
                <CheckCircle />
              </Tooltip>
            )}
          </CardContent>
          <CardContent sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Typography variant="body2" ml={1.5} mt={-2}>
              <span style={{ marginRight: "10px" }}>
                <b>{props.warehouse}</b>
                {props.warehouse_in}
              </span>
              <span>
                <b>{props.dep}</b>
                {props.dep_in}
              </span>
            </Typography>
          </CardContent>
        </Card>
      </TableCell>
    </TableRow>
  );

  return <>{deleted ? null : operation}</>;
}
