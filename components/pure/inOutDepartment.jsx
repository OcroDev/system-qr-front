import React from "react";
import Link from "next/link";
//MATERIAL UI
import { TableCell, TableRow, IconButton, Tooltip } from "@mui/material";

//MATERIAL ICONS
import { AddCircle } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addDepartment } from "../../redux/reducers/department/departmentOperationSlice";

export const InOutDepartment = ({ d_name, id }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" sx={{ color: "#efefef" }}>
          {id}
        </TableCell>
        <TableCell align="right" sx={{ color: "#efefef" }}>
          {d_name}
        </TableCell>
        <TableCell align="center">
          <IconButton
            sx={{ color: "warning.main" }}
            onClick={() => {
              dispatch(
                addDepartment({
                  id: id,
                  name: d_name,
                })
              );
              router.push("/operations/out/");
            }}
          >
            <Tooltip title="Seleccionar">
              <AddCircle />
            </Tooltip>
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};
