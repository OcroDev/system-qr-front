import React from "react";
import Link from "next/link";
//MATERIAL UI
import { TableCell, TableRow, IconButton, Tooltip } from "@mui/material";

//MATERIAL ICONS
import { DeleteForever, Update } from "@mui/icons-material";

export const User = ({
  id,
  u_username,
  u_firstname,
  u_lastname,
  handleOpenDialog,
}) => {
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" sx={{ color: "#efefef" }}>
          {id}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {u_firstname}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {u_lastname}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {u_username}
        </TableCell>
        <TableCell align="center">
          <Link href={`/users/update/${id}`}>
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
