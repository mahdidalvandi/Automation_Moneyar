import "../styles/globals.css";
// import "../components/pagination/style.scss";
import { StyledEngineProvider } from "@mui/material";

function MyApp({ Component, pageProps }) {
  return (
    <StyledEngineProvider injectFirst>
      <Component {...pageProps} />
    </StyledEngineProvider>
  );
}

export default MyApp;
