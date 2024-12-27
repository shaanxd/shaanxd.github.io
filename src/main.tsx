import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import init from "./game";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

init();

document.getElementById("canvas")?.addEventListener("blur", function () {
  this.focus();

  setTimeout(function () {
    // Some browsers won't let you do it until
    document.getElementById("canvas")?.focus(); // after the blur has completed
  }, 100);
});
