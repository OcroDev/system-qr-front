import { DeleteForever, Print } from "@mui/icons-material";
import {
  Card,
  CardContent,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function Orders(props) {
  const [deleted, setDeleted] = useState(false);

  //methods
  const deleteOrders = () => {
    let ordersURI = "http://localhost:5000/qrstock/api/orders/delete";
    axios
      .put(ordersURI, {
        id: props.id,
      })
      .then((response) => {
        console.log(response.data);
      });
  };

  let orders = (
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
                <b>Pedido # </b>({props.id})
              </span>
            </Typography>
            <Typography variant="body2" m={1}>
              <span style={{ marginRight: "10px" }}>
                <b>Colegio: </b>
                {props.warehouse}
              </span>
            </Typography>
            <Typography variant="body2" m={1}>
              <span>
                <b>Departamento: </b>
                {props.department}
              </span>
            </Typography>

            <IconButton
              sx={{ color: "primary.main", ml: 2 }}
              onClick={() => {}}
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
                deleteOrders();
              }}
              size="small"
            >
              <Tooltip title="Eliminar">
                <DeleteForever />
              </Tooltip>
            </IconButton>
          </CardContent>
        </Card>
      </TableCell>
    </TableRow>
  );

  return <>{!deleted ? orders : null}</>;
}
