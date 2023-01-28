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
  const styleCard = {
    width: 275,
    height: 150,
    m: 0.5,
    bgcolor: "#efefef",
    overflowY: "scroll",
  };
  const router = useRouter();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "75vw",
          overflowY: "scroll",
        }}
      >
        <Typography variant="h5">Requisiciones</Typography>
        <Divider></Divider>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Card sx={styleCard}>
            <CardContent sx={{}}>
              <Typography variant="h6">Reportes de Requisiciones</Typography>
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
          Materiales
        </Typography>
        <Divider></Divider>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
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
              <Typography variant="h6">
                Materiales en existencia mínima
              </Typography>
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
              <Typography variant="h6">Materiales con mayor salida</Typography>
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
      </Box>
    </>
  );
}
