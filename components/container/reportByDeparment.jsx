import {
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReportByDeparment() {
  //STATES
  const [departments, setDepartments] = useState();
  const [warehouses, setWarehouses] = useState();

  /**
   *  //*Formik
   */
  const initialValues = { d_name: "", w_description: "" };
  const validationSchema = yup.object().shape({
    d_name: yup.string("").required("El departamento es requerido"),
    w_description: yup.string("").required("El almacén es requerido"),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {},
  });

  useEffect(() => {
    getAllDepartments();
  }, []);

  //METHODS

  function getAllDepartments() {
    axios
      .get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/departments`)
      .then((response) => {
        const getAllDepartment = response.data.allDepartments;

        setDepartments(getAllDepartment);
      })
      .catch((error) => console.log(error.message));
  }

  function getAllWarehouses() {
    axios.get(`${process.env.NEXT_PUBLIC_URI_ENDPOINT}/qrstock/api/warehouses`);
  }

  //TODO: funciones para obetner departamentos y almacenes

  return (
    <>
      <CardContent>
        <form
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FormControl sx={{ width: 350, ml: 20, mt: 4, mb: 0 }}>
            <InputLabel id='d_name-label'>Departamento</InputLabel>
            <Select
              labelId='d_name-label'
              id='d_name'
              name='d_name'
              label='Departamento'
              value={formik.values.d_name}
              onChange={formik.handleChange}
              className='mb-4'
              variant='outlined'
            >
              {/* //TODO: hacer el menuItem partiendo del arreglo generado*/}
              <MenuItem value='' sx={{ color: "#efefef" }}>
                Selecciona el tipo de usuario
              </MenuItem>
              <MenuItem value={"worker"} sx={{ color: "#efefef" }}>
                Almacenista
              </MenuItem>
              <MenuItem value={"client"} sx={{ color: "#efefef" }}>
                Cliente
              </MenuItem>
            </Select>
          </FormControl>
          <FormHelperText color='error'>
            {formik.touched.d_name && Boolean(formik.errors.d_name)}
          </FormHelperText>
          <FormControl sx={{ width: 350, mt: 4, mb: 0 }}>
            <InputLabel id='w_description-label'>Colegio</InputLabel>
            <Select
              labelId='w_description-label'
              id='w_description'
              name='w_description'
              label='Almacén'
              value={formik.values.w_description}
              onChange={formik.handleChange}
              className='mb-4'
              variant='outlined'
            >
              {/* //TODO: hacer el menuItem partiendo del arreglo generado*/}
              <MenuItem value='' sx={{ color: "#efefef" }}>
                Selecciona el tipo de usuario
              </MenuItem>
              <MenuItem value={"worker"} sx={{ color: "#efefef" }}>
                Almacenista
              </MenuItem>
              <MenuItem value={"client"} sx={{ color: "#efefef" }}>
                Cliente
              </MenuItem>
            </Select>
          </FormControl>
          <FormHelperText color='error'>
            {formik.touched.w_description &&
              Boolean(formik.errors.w_description)}
          </FormHelperText>
          {/*//TODO: boton para generar reporte*/}
        </form>
      </CardContent>
    </>
  );
}
