import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

const theme = extendTheme({
  colors: {
    blue: {
      50: "#e8f3ff",
      100: "#c9e2ff",
      200: "#90c2ff",
      300: "#64a8ff",
      400: "#4593fc",
      500: "#3182f6",
      600: "#2272eb",
      700: "#1b64da",
      800: "#1957c2",
      900: "#194aa6",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </QueryParamProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
);
