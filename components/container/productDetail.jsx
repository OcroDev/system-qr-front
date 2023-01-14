import { Print, ArrowCircleLeft } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import QrCode from "../pure/qrCode";
import { useFormik } from "formik";
import * as yup from "yup";
import printServices from "../../print_services/printServices";
import Link from "next/link";

export default function ProductDetail(props) {
  const router = useRouter();
  const [product, setProduct] = useState({});
  useEffect(() => {
    getProduct();
  }, []);

  //Initial values for formik form
  const initialValues = {
    qrWidth: 150,
  };

  //VALIDATION SCHEMA
  const validationSchema = yup.object().shape({
    qrWidth: yup
      .number()
      .min(45, "El tamaño es muy pequeño, min:45")
      .max(200, "El tamaño es muy grande max:200")
      .required("El tamaño del Qr es requerido"),
  });

  //BUILD FORMIK
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      let img = document.body.ownerDocument.images.item(0).currentSrc;
      const productToPrint = {
        name: product.p_description,
        stock: product.p_stock,
        ubication: product.p_ubication,
        dataImage: img,
      };
      printServices.printOneQr(productToPrint);
    },
  });

  const getProduct = () => {
    axios
      .get(
        `http://localhost:5000/qrstock/api/products/update/${router.query.id}`
      )
      .then((response) => {
        setProduct(response.data.product);
      })
      .catch();
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          mt: -30,
          bgcolor: "#efefef",
          flexDirection: "row",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                component="div"
                variant="h5"
                sx={{ mb: 2 }}
                color={"error"}
              >
                {product.p_description}
              </Typography>
              <Typography variant="subtitle1" component="div">
                Existencia: {product.p_stock}
              </Typography>
              <Typography variant="subtitle1" component="div">
                Ubicación: {product.p_ubication}
              </Typography>
            </CardContent>
            <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
              <IconButton aria-label="print" type="submit">
                <Tooltip title="imprimir">
                  <Print color="primary" sx={{ height: 30, width: 30 }} />
                </Tooltip>
              </IconButton>
              <Link href="/products/update">
                <IconButton aria-label="next">
                  <Tooltip title="Regresar">
                    <ArrowCircleLeft
                      color="info"
                      sx={{ height: 30, width: 30 }}
                    />
                  </Tooltip>
                </IconButton>
              </Link>
              {/* <TextField
                sx={{ width: 68, flexDirection: "column" }}
                variant="standard"
                id="qrWidth"
                name="qrWidth"
                label="Tamaño QR"
                type="text"
                value={formik.values.qrWidth}
                onChange={formik.handleChange}
                error={formik.touched.qrWidth && Boolean(formik.errors.qrWidth)}
                helperText={formik.touched.qrWidth && formik.errors.qrWidth}
              /> */}
            </Box>
          </Box>
        </form>

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
          <QrCode
            width={formik.values.qrWidth}
            name={product.p_description}
            ubication={product.p_ubication}
            stock={product.p_stock}
          ></QrCode>
        </div>
      </Card>
    </>
  );
}
