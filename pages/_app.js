//STYLES

import { ThemeProvider } from "@mui/material";
import { myTheme } from "../theme/theme";
import "../styles/globals.css";

//DEPENDENCIES
import Layout from "../components/layout";

//REDUX
import store from "../redux/store";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={myTheme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}
