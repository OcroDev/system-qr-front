import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { db, cm } from "../../print_services/logos";

export default function Company() {
  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: -90,
          marginBottom: 300,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 50,
        }}
      >
        <img
          style={{ marginTop: -20 }}
          src={`data:image/png;base64,${db}`}
          alt=""
          width={60}
          height={70}
        />
        <div>
          <Typography variant="h4" align="center" sx={{ ml: 5, mr: 5 }}>
            {`COLEGIOS LOS PIRINEOS DON BOSCO`}
          </Typography>
          <Typography variant="h4" align="center" sx={{ ml: 5, mr: 5 }}>
            {`Y METROPOLITANO`}
          </Typography>
        </div>
        <img
          style={{ marginTop: -20 }}
          src={`data:image/png;base64,${cm}`}
          alt=""
          width={60}
          height={70}
        />
      </div>
    </>
  );
}
