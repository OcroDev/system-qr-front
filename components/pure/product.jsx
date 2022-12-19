import React from "react";
import Link from "next/link";
//MATERIAL UI
import { TableCell, TableRow, IconButton, Tooltip } from "@mui/material";

//MATERIAL ICONS
import { DeleteForever, Update } from "@mui/icons-material";

export const Product = ({
  p_desription,
  p_ubication,
  id,
  handleOpenDialog,
}) => {
  const checkid = (idbutton) => {
    console.log("id del producto:", idbutton);
  };
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" sx={{ color: "#efefef" }}>
          {id}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {p_desription}
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
          <IconButton
            sx={{ color: "error.main" }}
            onClick={() => handleOpenDialog(id)}
          >
            <Tooltip title="Eliminar">
              <DeleteForever />
            </Tooltip>
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};
