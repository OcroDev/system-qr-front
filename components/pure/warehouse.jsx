import React from "react";
import Link from "next/link";
//MATERIAL UI
import { TableCell, TableRow, IconButton, Tooltip } from "@mui/material";

//MATERIAL ICONS
import { DeleteForever, Update } from "@mui/icons-material";

export const Warehouse = ({ w_description, id, handleOpenDialog }) => {
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" sx={{ color: "#efefef" }}>
          {id}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {w_description}
        </TableCell>
        <TableCell align="center">
          <Link href={`/warehouse/update/${id}`}>
            <IconButton sx={{ color: "info.main" }} aria-label="Actualizar">
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
