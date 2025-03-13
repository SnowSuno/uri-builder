import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Provider } from "./components/ui/provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Toaster />
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </QueryParamProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
