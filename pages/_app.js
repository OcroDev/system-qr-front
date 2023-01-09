//STYLES

import { ThemeProvider } from "@mui/material";
import { myTheme } from "../theme/theme";
import "../styles/globals.css";

//DEPENDENCIES
import Layout from "../components/layout";

//REDUX
import store from "../redux/store";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import LoginForm from "../components/form/loginForm";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const [logedIn, setLogedIn] = useState();

  const loggedIn = () => {
    setLogedIn(sessionStorage.getItem("user"));
  };
  useEffect(() => {
    loggedIn();
  });

  return (
    <Provider store={store}>
      {logedIn ? (
        <ThemeProvider theme={myTheme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      ) : (
        <LoginForm />
      )}
    </Provider>
  );
}
