import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/prompt/thai-400.css";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-600.css";
import "@fontsource/prompt/latin-400.css";
import "@fontsource/prompt/latin-500.css";
import "@fontsource/prompt/latin-600.css";
import "@fontsource/sarabun/thai-400.css";
import "@fontsource/sarabun/thai-500.css";
import "@fontsource/sarabun/thai-600.css";
import "@fontsource/sarabun/latin-400.css";
import "@fontsource/sarabun/latin-500.css";
import "@fontsource/sarabun/latin-600.css";
import "@fontsource/noto-sans-thai/thai-400.css";
import "./styles/tokens.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);