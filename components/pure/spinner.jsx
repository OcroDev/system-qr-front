import { CircularProgress, Stack } from '@mui/material'
import React from 'react'

export default function Spinner(props) {
  return (
    <Stack sx={{ color: 'grey.500', display: "flex", alignItems: "center", justifyContent: "center" }}  direction="row">
      <CircularProgress color="primary"/>
    </Stack>
  )
}
