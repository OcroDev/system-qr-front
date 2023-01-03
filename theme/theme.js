import { createTheme } from "@mui/material";

export const myTheme = createTheme({
  palette: {
    primary: {
      main: "#0c818a",
      light: "rgb(101,115,195)",
      dark: "rgb(44,56,126)",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f50057",
      light: "rgb(247,51,120)",
      dark: "rgb(171,0,60)",
      contrastText: "#000",
    },
    error: {
      main: "#f44336",
      light: "rgb(246,104,94)",
      dark: "rgba(170,46,37,0.1)",
      contrastText: "#fff",
    },
    warning: {
      main: "#ff9800",
      light: "rgb(255,172,51)",
      dark: "rgb(178,106,0)",
      contrastText: "#fff",
    },
    info: {
      main: "#2196f3",
      light: "rgb(77,171,245)",
      dark: "rgb(23,105,170)",
      contrastText: "#fff",
    },
    success: {
      main: "#4caf50",
      light: "rgb(111,191,115)",
      dark: "rgb(53,122,156)",
      contrastText: "#fff",
    },
    divider: "rgba(255,255,255,0.5)",
    background: {
      default: "#313131",
      paper: "#343a40",
      contrastText: "#fff",
    },
  },
});
