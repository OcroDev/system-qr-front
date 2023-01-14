import React from "react";
import Link from "next/link";
//MATERIAL UI
import { TableCell, TableRow, IconButton, Tooltip } from "@mui/material";

//MATERIAL ICONS
import { DeleteForever, Update, Print } from "@mui/icons-material";
import QrCode from "./qrCode";

export const Product = ({
  p_desription,
  p_ubication,
  id,
  p_unit,
  p_minstock,
  p_stock,
  handleOpenDialog,
}) => {
  const checkid = (idbutton) => {};
  return (
    <>
      <TableRow>
        {/* <TableCell component="th" scope="row" sx={{ color: "#efefef" }}>
          {id}
        </TableCell> */}
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {p_desription}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {p_minstock}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {p_unit}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {p_ubication}
        </TableCell>
        <TableCell align="center">
          <Link href={`/products/update/${id}`}>
            <IconButton sx={{ color: "info.main" }}>
              <Tooltip title="Actualizar">
                <Update />
              </Tooltip>
            </IconButton>
          </Link>
          <Link href={`/products/detail/${id}`}>
            <IconButton sx={{ color: "success.main" }}>
              <Tooltip title="print">
                <Print />
              </Tooltip>
            </IconButton>
          </Link>
          <IconButton
            sx={{ color: "error.main" }}
            onClick={() => handleOpenDialog(id)}
          >
            <Tooltip title="Eliminar">
              <DeleteForever />
            </Tooltip>
          </IconButton>
        </TableCell>
        <TableCell>
          <QrCode
            name={p_desription}
            ubication={p_ubication}
            stock={p_stock}
            width={85}
            type="images"
          />
        </TableCell>
      </TableRow>
    </>
  );
};
