import { DeleteForever, Print } from "@mui/icons-material";
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

export default function Operation(props) {
  const [deleted, setDeleted] = useState(false);

  const updateStockProduct = (movements) => {
    console.log(movements);
    movements.map((product) => {
      const type = props.type === "in" ? 1 : 2;
      const options = {
        method: "PUT",
        url: "http://localhost:5000/qrstock/api/products/update-stock",
        data: {
          id: product.product_id,
          p_stock: product.mov_quantity,
          operation_type: type,
        },
      };
      axios
        .request(options)
        .then((response) => console.log(response.data.status))
        .catch((error) => console.log(error.message));
    });
  };
  const deleteOperation = () => {
    let operationURI = "http://localhost:5000/qrstock/api/operations/delete";
    let movementsURI = "http://localhost:5000/qrstock/api/movements/delete";
    let operationCodURI = "http://localhost:5000/qrstock/api/movements/op-cod";
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
            .then((response) => console.log(response.data.message))
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
      .catch((error) => console.log(error.data.message));
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
          <CardContent sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="body2" m={1}>
              <span>
                <b>Fecha: </b>
                {props.date}
              </span>
            </Typography>
            <Typography variant="body2" m={1}>
              <span>
                <b>Reporte # </b>({props.id})
              </span>
            </Typography>
            <Typography variant="body2" m={1}>
              <span>
                <b>{props.inOut}: </b>({props.productsTotal})
              </span>
            </Typography>
            <IconButton
              sx={{ color: "primary.main", ml: 2 }}
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
              sx={{ color: "error.main", ml: 2 }}
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
          </CardContent>
          <Typography variant="body2" ml={3} mt={-2}>
            <span style={{ marginRight: "10px" }}>
              <b>{props.warehouse}</b>
              {props.warehouse_in}
            </span>
            <span>
              <b>{props.dep}</b>
              {props.dep_in}
            </span>
          </Typography>
        </Card>
      </TableCell>
    </TableRow>
  );

  return <>{deleted ? null : operation}</>;
}