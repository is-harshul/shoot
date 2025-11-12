import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";

import { PopupApp } from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <PopupApp />
  </StrictMode>
);
