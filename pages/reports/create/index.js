import React from "react";
import { jsPDF } from "jspdf";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/system";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

import printServices from "../../../print_services/printServices";

export default function ReportCreate() {
  const movementProducts = useSelector((state) => state.opProduct);

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );
  const styleCard = { width: 275, height: 150, m: 0.5, bgcolor: "#efefef" };
  const router = useRouter();
  return (
    <>
      <Typography variant="h5">Operaciones</Typography>
      <Divider></Divider>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Card sx={styleCard}>
          <CardContent>
            <Typography variant="h6">Reportes de Operaciones</Typography>
            <Button
              variant="contained"
              size="medium"
              color="info"
              sx={{ mt: 5 }}
              onClick={() => router.push("/reports/operations")}
            >
              Ver
            </Button>
          </CardContent>
          <CardActions></CardActions>
        </Card>
      </div>
      <Typography variant="h5">Productos</Typography>
      <Divider></Divider>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Card sx={styleCard}>
          <CardContent>
            <Typography variant="h6">Reporte de Inventario</Typography>
            <Button
              sx={{ mt: 5 }}
              variant="outlined"
              size="medium"
              color="info"
              onClick={() => createDocument(movementProducts.products)}
            >
              Ver
            </Button>
          </CardContent>
        </Card>
        <Card sx={styleCard}>
          <CardContent>
            <Typography variant="h6">Productos en stock mínimo</Typography>
            <Button
              size="medium"
              variant="outlined"
              color="info"
              sx={{ mt: 1 }}
            >
              Ver
            </Button>
          </CardContent>
        </Card>
      </div>
      <br />
      <Typography variant="h5">Departamentos</Typography>
      <Divider></Divider>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Card sx={styleCard}>
          <CardContent>
            <Typography variant="h6">Reporte de departamentos</Typography>
            <Button
              size="medium"
              variant="outlined"
              color="info"
              sx={{ mt: 1 }}
              onClick={() => printServices.print()}
            >
              Ver
            </Button>
          </CardContent>
        </Card>
        <Card sx={styleCard}>
          <CardContent>
            <Typography variant="h6">Reporte de departamentos</Typography>
            <Button
              size="medium"
              variant="outlined"
              color="info"
              sx={{ mt: 1 }}
            >
              Ver
            </Button>
          </CardContent>
        </Card>
        <Card sx={styleCard}>
          <CardContent>
            <Typography variant="h6">Reporte de departamentos</Typography>
            <Button
              size="medium"
              variant="outlined"
              color="info"
              sx={{ mt: 1 }}
            >
              Ver
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
