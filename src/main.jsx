import { ContentProvider } from "./content";
import { ThemeProvider } from "./theme";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/theme.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider><ContentProvider><App /></ContentProvider></ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
