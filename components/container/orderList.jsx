import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import Orders from "../pure/orders";
import {
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";

export default function OrderList() {
  //states
  const [orders, setOrders] = useState([]);
  const [searchWarehouse, setSearchWarehouse] = useState("");

  //METHODS
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    const options = {
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/orders/report`,
      headers: { "Content-Type": "application/json" },
    };

    axios
      .request(options)
      .then(function (response) {
        setOrders(response.data.ordersReport);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const searchHandler = (e) => {
    setSearchWarehouse(e.target.value);
  };
  // FILTER
  const ordersFilter = !searchWarehouse
    ? orders
    : orders.filter((data) =>
        data.warehouse_name
          .toUpperCase()
          .includes(searchWarehouse.toUpperCase())
      );

  return (
    <div>
      <Box sx={{ width: "70vw", bgcolor: "#efefef", mt: -10 }}>
        <br />
        <Typography align="center" variant="h5">
          Pedidos
        </Typography>
        <div style={{ overflowY: "scroll" }}>
          <TableContainer sx={{ overflowY: "scroll", height: "40vh" }}>
            <Table>
              <TableBody>
                {ordersFilter.map((order) => {
                  return (
                    <Orders
                      key={order.id}
                      id={order.id}
                      date={order.date}
                      warehouse={order.warehouse_name}
                      department={order.department_name}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Box sx={{ m: 3 }}>
          <TextField
            variant="standard"
            label="Buscar por Colegio"
            type="text"
            value={searchWarehouse}
            onChange={searchHandler}
            color="info"
          ></TextField>
        </Box>
        <br />
      </Box>
    </div>
  );
}
