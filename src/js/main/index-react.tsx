import React from "react";
import ReactDOM from "react-dom/client";
import { initBolt } from "../lib/utils/bolt";
import "../globals.css";
import { App } from "./main";

// Auto-reload w panelu CEP (zmień na false żeby wyłączyć)
const AUTO_RELOAD_IN_CEP = true;

initBolt();

// HMR auto-reload dla panelu w Illustratorze
if (AUTO_RELOAD_IN_CEP && import.meta.hot) {
  import.meta.hot.on("vite:beforeFullReload", () => {
    if (window.cep) {
      window.location.reload();
    }
  });
}

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
