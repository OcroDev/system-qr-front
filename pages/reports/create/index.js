import React from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import printServices from "../../../print_services/printServices";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

export default function ReportCreate() {
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

      <Typography variant="h5" mt={5}>
        Productos
      </Typography>
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
              onClick={() => printServices.productReport()}
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
              onClick={() => printServices.productMinStock()}
            >
              Ver
            </Button>
          </CardContent>
        </Card>
        <Card sx={styleCard}>
          <CardContent>
            <Typography variant="h6">Productos con mayor salida</Typography>
            <Button
              size="medium"
              variant="outlined"
              color="info"
              sx={{ mt: 1 }}
              onClick={() => printServices.productMustOut()}
            >
              Ver
            </Button>
          </CardContent>
        </Card>
      </div>
      <br />
    </>
  );
}
