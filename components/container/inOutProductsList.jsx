//DEPENDENCIES
import { InOutProduct } from "../pure/inOutProduct";
//MATERIAL UI
import {
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CardActions,
} from "@mui/material";

//MATERIAL ICONS
import { Reply } from "@mui/icons-material";
//REACT
import { useEffect, useState } from "react";
//REDUX
import { useSelector } from "react-redux";
//AXIOS
import axios from "axios";
import { useRouter } from "next/router";

export default function InOutProductsList() {
  const router = useRouter();

  //STATES
  const { operation_type } = useSelector((state) => state.opType);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  //FETCH DATA
  useEffect(() => {
    getAllProducts();
  }, []);

  //METHODS

  function getAllProducts() {
    axios
      .get("http://localhost:5000/qrstock/api/products")
      .then((response) => {
        const getAllProduct = response.data.allProducts;

        setProducts(getAllProduct);
      })
      .catch((error) => console.log(error));
  }

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  const handleCloseConfirmDialog = (idFromProduct) => {
    setopenDialog(false);
    deleteProduct(idFromProduct);
  };

  const deleteProduct = (id) => {
    axios(`http://localhost:5000/qrstock/api/products/${id}`, {
      method: "",
    }).then((response) => {
      setDeleteSuccess(true);
      setApiMessage(response.data.message);
      getAllProducts();
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 2000);
    });
  };

  //Filtrado
  const productFilter = !search
    ? products
    : products.filter((data) =>
        data.p_description.toUpperCase().includes(search.toUpperCase())
      );

  return (
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
          width: "75vw",
          height: "80vh",
          overflowY: "scroll",
        }}
      >
        <CardContent
          sx={{
            position: "absolute",
            background: "#fff",
            width: "75vw",
            zIndex: "998",
          }}
        >
          <Typography fontFamily={"monospace"} align="center" variant="h5">
            PRODUCTOS
          </Typography>

          <TextField
            variant="standard"
            label="Buscar Producto"
            type="text"
            value={search}
            onChange={searchHandler}
          ></TextField>
        </CardContent>
        <CardContent>
          <TableContainer
            sx={{
              bgcolor: "background.paper",
              marginTop: 15,
              maxHeight: "50vh",
            }}
          >
            <div style={{ overflowY: "scroll", maxHeight: "50vh" }}>
              <Table sx={{ maxWidth: "75vw" }}>
                <TableHead sx={{ marginTop: 4 }}>
                  <TableRow>
                    <TableCell sx={{ color: "#efefef", fontWeight: "bold" }}>
                      ID
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#efefef", fontWeight: "bold" }}
                    >
                      Nombre del Producto
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#efefef", fontWeight: "bold" }}
                    >
                      Existencia Actual
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#efefef", fontWeight: "bold" }}
                    >
                      Cantidad
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "#efefef", fontWeight: "bold" }}
                    >
                      Añadir
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productFilter.map((product) => {
                    return (
                      <InOutProduct
                        key={product.id}
                        id={product.id}
                        p_description={product.p_description}
                        stock={product.p_stock}
                        opType={operation_type}
                        minstock={product.p_minstock}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </CardContent>
        <CardContent>
          <CardActions>
            <Button
              variant="contained"
              startIcon={<Reply />}
              color="info"
              onClick={() =>
                operation_type == "IN"
                  ? router.push("/operations/in")
                  : router.push("/operations/out")
              }
            >
              Regresar
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </div>
  );
}
