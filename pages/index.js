import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTotalOrders } from "../redux/reducers/orderBadge/orderBadgeSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { totalOrders } = useSelector((state) => state.orderBadge);

  useEffect(() => {
    getTotalOrders();
  }, []);

  const getTotalOrders = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/orders/`)
      .then((response) => {
        const getTotal = response.data.orders.length;

        dispatch(setTotalOrders(getTotal));
      });
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#343a402f",
          paddingRight: "1rem",
          paddingLeft: "1rem",
          borderRadius: "60px",
        }}
      >
        <h1>Selecciona una opción en el panel izquierdo</h1>
      </div>
    </>
  );
}
